import { useState, useRef, useCallback } from 'react'
import { CHARACTERS, SHOTS, SCORE_SEGMENTS } from './data/production'
import './App.css'

const REPLICATE_API_KEY = import.meta.env.VITE_REPLICATE_API_KEY || '';

const PHASES = [
  { id: 'casting', label: 'Casting', icon: 'C' },
  { id: 'voice', label: 'Voice', icon: 'V' },
  { id: 'tableread', label: 'Table Read', icon: 'T' },
  { id: 'score', label: 'Score', icon: 'S' },
  { id: 'photography', label: 'Photography', icon: 'P' },
  { id: 'post', label: 'Post', icon: 'X' },
  { id: 'final', label: 'Final', icon: 'F' },
];

function timestamp() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

async function createPrediction(prompt) {
  const response = await fetch('/api/replicate/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${REPLICATE_API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'respond-async'
    },
    body: JSON.stringify({
      model: 'black-forest-labs/flux-1.1-pro',
      input: {
        prompt,
        width: 1344,
        height: 560,
        output_format: 'png',
        output_quality: 95,
        guidance_scale: 3.5
      }
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }
  return response.json();
}

async function pollPrediction(id) {
  const r = await fetch(`/api/replicate/v1/predictions/${id}`, {
    headers: { 'Authorization': `Bearer ${REPLICATE_API_KEY}` }
  });
  const p = await r.json();
  if (p.status === 'succeeded') return p.output;
  if (p.status === 'failed') throw new Error(p.error || 'Generation failed');
  if (p.status === 'canceled') throw new Error('Generation canceled');
  await new Promise(resolve => setTimeout(resolve, 3000));
  return pollPrediction(id);
}

function CharacterCard({ character, images, approvedIdx, onGenerate, onApprove, onUpload, generating }) {
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef(null);
  const isCast = approvedIdx !== null && approvedIdx !== undefined;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(character.id, url);
    e.target.value = '';
  };

  return (
    <div className={`character-card ${isCast ? 'cast' : ''}`}>
      <div className="card-header">
        <div className="card-avatar" style={{ background: character.color }}>
          {character.name[0]}
        </div>
        <div className="card-header-info">
          <h3>{character.name}</h3>
          <div className="card-role">{character.role}</div>
        </div>
        <span className={`card-status ${isCast ? 'cast' : 'pending'}`}>
          {isCast ? 'CAST' : 'PENDING'}
        </span>
      </div>

      <div className="card-body">
        <div className="card-description">{character.description}</div>

        <button className="expand-toggle" onClick={() => setExpanded(!expanded)}>
          {expanded ? '- Hide details' : '+ Show details'}
        </button>

        {expanded && (
          <>
            <div className="card-detail-row">
              <span className="card-detail-label">Voice Ref</span>
              <span className="card-detail-value">{character.voiceRef}</span>
            </div>
            <div className="card-detail-row">
              <span className="card-detail-label">Direction</span>
              <span className="card-detail-value">{character.voiceDirection}</span>
            </div>
            <div className="card-lines">
              <div className="card-lines-title">Sample Lines</div>
              {character.sampleLines.map((line, i) => (
                <div key={i} className="sample-line">{line}</div>
              ))}
            </div>
            <div className="prompt-display">
              <div className="prompt-label">Image Prompt</div>
              <div className="prompt-text">{character.imagePrompt}</div>
            </div>
          </>
        )}
      </div>

      {/* Image grid */}
      {(images.length > 0 || generating) && (
        <div className="image-grid">
          {images.map((img, i) => (
            <div
              key={i}
              className={`image-cell ${approvedIdx === i ? 'approved' : ''}`}
              onClick={() => !generating && onApprove(character.id, i)}
              title={approvedIdx === i ? 'Approved' : 'Click to approve'}
            >
              {img.status === 'loading' && (
                <div className="image-loading">
                  <div className="spinner" />
                  <span>Take {i + 1}...</span>
                </div>
              )}
              {img.status === 'done' && (
                <>
                  <img src={img.url} alt={`${character.name} take ${i + 1}`} />
                  {approvedIdx === i && <div className="approve-badge">&#10003;</div>}
                </>
              )}
              {img.status === 'error' && (
                <div className="image-error">{img.error || 'Failed'}</div>
              )}
            </div>
          ))}
          {/* Fill empty slots up to 3 during generation */}
          {generating && images.length < 3 && Array.from({ length: 3 - images.length }).map((_, i) => (
            <div key={`empty-${i}`} className="image-cell">
              <div className="image-loading">
                <div className="spinner" />
                <span>Queued...</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload */}
      <div className="upload-row">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
          Upload reference image
        </button>
      </div>

      <div className="card-actions">
        <button
          className="btn btn-primary"
          disabled={generating}
          onClick={() => onGenerate(character.id)}
        >
          {generating ? 'Generating...' : 'Generate 3 Refs'}
        </button>
        {isCast && (
          <span style={{ fontSize: 11, color: 'var(--green)', alignSelf: 'center' }}>
            Take {approvedIdx + 1} approved
          </span>
        )}
      </div>
    </div>
  );
}

function CastingPhase({ castingState, setCastingState, addLog }) {
  const castCount = Object.values(castingState).filter(s => s.approvedIdx !== null).length;

  const handleGenerate = useCallback(async (charId) => {
    const character = CHARACTERS.find(c => c.id === charId);
    if (!character) return;

    addLog(`Calling casting for ${character.name} — 3 takes`, 'info');

    setCastingState(prev => ({
      ...prev,
      [charId]: {
        ...prev[charId],
        generating: true,
        images: [
          { status: 'loading' },
          { status: 'loading' },
          { status: 'loading' },
        ],
      }
    }));

    for (let i = 0; i < 3; i++) {
      try {
        const prediction = await createPrediction(character.imagePrompt);
        addLog(`${character.name} take ${i + 1} — prediction ${prediction.id}`, 'info');

        const output = await pollPrediction(prediction.id);
        const url = Array.isArray(output) ? output[0] : output;

        setCastingState(prev => {
          const images = [...prev[charId].images];
          images[i] = { status: 'done', url };
          return {
            ...prev,
            [charId]: { ...prev[charId], images }
          };
        });

        addLog(`${character.name} take ${i + 1} — ready`, 'success');
      } catch (err) {
        setCastingState(prev => {
          const images = [...prev[charId].images];
          images[i] = { status: 'error', error: err.message };
          return {
            ...prev,
            [charId]: { ...prev[charId], images }
          };
        });
        addLog(`${character.name} take ${i + 1} — failed: ${err.message}`, 'error');
      }
    }

    setCastingState(prev => ({
      ...prev,
      [charId]: { ...prev[charId], generating: false }
    }));

    addLog(`${character.name} — all takes complete. Awaiting Director approval.`, 'info');
  }, [setCastingState, addLog]);

  const handleApprove = useCallback((charId, idx) => {
    const character = CHARACTERS.find(c => c.id === charId);
    const img = castingState[charId]?.images[idx];
    if (!img || img.status !== 'done') return;

    setCastingState(prev => ({
      ...prev,
      [charId]: { ...prev[charId], approvedIdx: idx }
    }));
    addLog(`Director approved ${character.name} — Take ${idx + 1}`, 'success');
  }, [castingState, setCastingState, addLog]);

  const handleUpload = useCallback((charId, url) => {
    const character = CHARACTERS.find(c => c.id === charId);
    setCastingState(prev => {
      const images = [...(prev[charId]?.images || [])];
      images.push({ status: 'done', url });
      return {
        ...prev,
        [charId]: { ...prev[charId], images }
      };
    });
    addLog(`Uploaded reference image for ${character.name}`, 'info');
  }, [setCastingState, addLog]);

  return (
    <>
      <div className="phase-header">
        <h2>Casting</h2>
        <div className="phase-desc">
          Generate and approve reference portraits for each character. 3 takes per character — pick the best.
        </div>
        <div className="phase-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(castCount / CHARACTERS.length) * 100}%` }} />
          </div>
          <span className="progress-label">{castCount}/{CHARACTERS.length} cast</span>
        </div>
      </div>

      <div className="character-grid">
        {CHARACTERS.map(char => (
          <CharacterCard
            key={char.id}
            character={char}
            images={castingState[char.id]?.images || []}
            approvedIdx={castingState[char.id]?.approvedIdx ?? null}
            generating={castingState[char.id]?.generating || false}
            onGenerate={handleGenerate}
            onApprove={handleApprove}
            onUpload={handleUpload}
          />
        ))}
      </div>
    </>
  );
}

function PhasePlaceholder({ phase }) {
  const descriptions = {
    voice: 'Clone character voices with ElevenLabs. Requires cast approval first.',
    tableread: 'Generate dialogue for all 24 shots. Requires voice clones.',
    score: 'Generate 4 score segments with Suno AI.',
    photography: 'Generate video for 15 shots using Kling via Replicate.',
    post: 'Assemble timeline, add VFX title cards, mix audio.',
    final: 'Review the complete trailer. Export and deliver.',
  };

  return (
    <>
      <div className="phase-header">
        <h2>{phase.label}</h2>
        <div className="phase-desc">{descriptions[phase.id]}</div>
      </div>
      <div className="phase-placeholder">
        <h3>{phase.label} Phase</h3>
        <p>{descriptions[phase.id]}</p>
        <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 12 }}>
          Complete earlier phases to unlock.
        </p>
      </div>
    </>
  );
}

function ProducerLog({ entries }) {
  const logRef = useRef(null);

  return (
    <div className="sidebar-right">
      <div className="log-header">
        <h3>Producer Log</h3>
      </div>
      <div className="log-entries" ref={logRef}>
        {entries.length === 0 && (
          <div className="log-entry">
            <div className="log-time">{timestamp()}</div>
            <div className="log-message">Session started. Ready for Director.</div>
          </div>
        )}
        {entries.map((entry, i) => (
          <div key={i} className="log-entry">
            <div className="log-time">{entry.time}</div>
            <div className={`log-message ${entry.type || ''}`}>{entry.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [activePhase, setActivePhase] = useState('casting');
  const [logEntries, setLogEntries] = useState([]);
  const [castingState, setCastingState] = useState(() => {
    const state = {};
    CHARACTERS.forEach(c => {
      state[c.id] = { images: [], approvedIdx: null, generating: false };
    });
    return state;
  });

  const addLog = useCallback((message, type = '') => {
    setLogEntries(prev => [...prev, { time: timestamp(), message, type }]);
  }, []);

  const castCount = Object.values(castingState).filter(s => s.approvedIdx !== null).length;

  const getPhaseStatus = (phaseId) => {
    if (phaseId === 'casting') {
      if (castCount === CHARACTERS.length) return 'done';
      if (castCount > 0) return 'partial';
      return '';
    }
    return '';
  };

  const activePhaseObj = PHASES.find(p => p.id === activePhase);

  return (
    <div className="app">
      {/* Left Sidebar */}
      <div className="sidebar-left">
        <div className="sidebar-logo">
          <h1>The Producer</h1>
          <div className="subtitle">THE BLOCK — Red Band Trailer</div>
        </div>
        <div className="sidebar-nav">
          {PHASES.map((phase, i) => {
            const status = getPhaseStatus(phase.id);
            return (
              <button
                key={phase.id}
                className={`nav-item ${activePhase === phase.id ? 'active' : ''}`}
                onClick={() => setActivePhase(phase.id)}
              >
                <span className="nav-number">{i + 1}</span>
                {phase.label}
                {status === 'done' && <span className="nav-status" style={{ color: 'var(--green)' }}>&#10003;</span>}
                {status === 'partial' && <span className="nav-status" style={{ color: 'var(--amber)' }}>&#8226;</span>}
              </button>
            );
          })}
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text-muted)' }}>
            {SHOTS.length} shots &middot; {CHARACTERS.length} characters
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text-muted)' }}>
            {SHOTS.filter(s => s.needsVideo).length} video gen &middot; {SCORE_SEGMENTS.length} score segments
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activePhase === 'casting' ? (
          <CastingPhase
            castingState={castingState}
            setCastingState={setCastingState}
            addLog={addLog}
          />
        ) : (
          <PhasePlaceholder phase={activePhaseObj} />
        )}
      </div>

      {/* Right Sidebar */}
      <ProducerLog entries={logEntries} />
    </div>
  );
}

export default App
