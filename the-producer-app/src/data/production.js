export const CHARACTERS = [
  {
    id: 'kevin',
    name: 'Kevin',
    role: 'Protagonist',
    color: '#5b8dd9',
    description: 'Late 30s. Rumpled oxford. Tired eyes that spark with hope.',
    imagePrompt: 'Cinematic portrait, man late 30s, dark hair slightly disheveled, wearing rumpled blue oxford shirt untucked, tired but intelligent eyes, warm lighting, shallow depth of field, film grain, anamorphic bokeh, realistic photography, 2.39:1 aspect ratio',
    voiceRef: 'Jason Bateman narration energy',
    voiceDirection: 'Dry, warm, slightly defeated. Comedy is in the pauses.',
    sampleLines: [
      'His name was Moe.',
      'Is Judy going to need a per diem?',
      'Was there ever a seller?',
      'What kind of block?'
    ],
    voiceSettings: { stability: 0.55, similarity_boost: 0.75, style: 0.3 }
  },
  {
    id: 'moe',
    name: 'Moe',
    role: 'The Operator',
    color: '#d4a843',
    description: 'Early 40s. Immaculate charcoal suit, pocket square. Radiates competence.',
    imagePrompt: 'Cinematic portrait, handsome man early 40s, immaculate charcoal suit with pocket square, open collar white shirt, calm confident expression, upscale hotel lobby with espresso, warm amber tones, film grain, anamorphic bokeh, realistic photography, 2.39:1 aspect ratio',
    voiceRef: 'Oscar Isaac cadence. George Clooney in Michael Clayton.',
    voiceDirection: 'Smooth, measured, every word selected. When doubt creeps in: hairline crack in marble.',
    sampleLines: [
      'Kevin. Good morning. I have something.',
      'A block. Anthropic.',
      'We have a problem.',
      'There was no seller.'
    ],
    voiceSettings: { stability: 0.75, similarity_boost: 0.8, style: 0.15 }
  },
  {
    id: 'jerry',
    name: 'Jerry',
    role: 'Best Friend',
    color: '#4fa366',
    description: "Late 30s. Patagonia vest. Mason jar of overnight oats he doesn't enjoy.",
    imagePrompt: 'Cinematic portrait, man late 30s, slightly overweight, friendly face, Patagonia vest over grey crewneck, holding mason jar with long spoon, city sidewalk morning light, film grain, anamorphic bokeh, realistic photography, 2.39:1 aspect ratio',
    voiceRef: 'Nick Kroll reasonable voice. Dad energy.',
    voiceDirection: 'Everyman. Slightly nasal. Devastating one-liners delivered completely deadpan.',
    sampleLines: [
      "That's a shakedown.",
      'Bridges also collect tolls.',
      'Who the hell is Alyx?',
      'Exactly my point.'
    ],
    voiceSettings: { stability: 0.5, similarity_boost: 0.7, style: 0.4 }
  },
  {
    id: 'carly',
    name: 'Carly',
    role: 'Scene-Stealer',
    color: '#d44848',
    description: 'Early 40s. Tailored blazer. Reading glasses on head. Controlled fury.',
    imagePrompt: 'Cinematic portrait, woman early 40s, sharp features, tailored navy blazer, reading glasses pushed up on head, cluttered law desk, chewing almonds with intensity, overhead office lighting, film grain, anamorphic bokeh, realistic photography, 2.39:1 aspect ratio',
    voiceRef: 'Julia Louis-Dreyfus in Veep.',
    voiceDirection: 'Precise. Clipped. Never yells. The quieter she gets, the funnier it is.',
    sampleLines: [
      'No.',
      "Don't ever call it that again.",
      'PENTAGONS ARE IRREGULAR.',
      'When will he make me money...'
    ],
    voiceSettings: { stability: 0.6, similarity_boost: 0.75, style: 0.35 }
  }
];

export const SHOTS = [
  { id: 't01', label: 'T-01', heading: 'Cold Open', type: 'VFX', timecode: '0:00-0:05', description: 'Black screen. V.O.', needsVideo: false, videoPrompt: null,
    dialogue: [
      { character: 'Kevin', line: 'His name was Moe.', direction: 'V.O., dry' },
      { character: 'Kevin', line: 'And Moe had a block.', direction: 'beat before block' }
    ]},
  { id: 't02', label: 'T-02', heading: 'Moe \u2014 Hotel Lobby', type: 'MEDIUM', timecode: '0:05-0:15', description: 'Moe seated. Espresso. "A block. Anthropic."', needsVideo: true,
    videoPrompt: 'Medium shot of a well-dressed man in his early 40s sitting in a leather chair in an upscale hotel lobby, wearing a charcoal suit with pocket square, open collar white shirt, holding small espresso cup, morning sunlight through tall windows, warm amber tones, speaks calmly, shallow depth of field, cinematic 24fps, anamorphic, film grain',
    dialogue: [
      { character: 'Moe', line: 'Kevin. Good morning. I have something.', direction: 'calm' },
      { character: 'Moe', line: 'A block. Anthropic.', direction: 'lets it land' }
    ]},
  { id: 't03', label: 'T-03', heading: 'Commission Stack', type: 'INSERT', timecode: '0:15-0:25', description: '8%\u2026 2%\u2026 1%\u2026 11% builds on screen.', needsVideo: false, videoPrompt: null, dialogue: [] },
  { id: 't04', label: 'T-04', heading: 'Kevin \u2014 Gift Basket', type: 'CLOSE', timecode: '0:25-0:30', description: 'Kevin on bed, phone. Disbelief.', needsVideo: true,
    videoPrompt: 'Close-up tired man late 30s on edge of bed in dim room, wrinkled t-shirt, phone to ear, expression shifts from hope to disbelief, warm side lighting, subtle push-in, 24fps, film grain',
    dialogue: [{ character: 'Kevin', line: 'Is Judy going to need a per diem? Does the seller want a gift basket?', direction: 'deadpan' }]},
  { id: 't05', label: 'T-05', heading: 'Jerry \u2014 Shakedown', type: 'MEDIUM', timecode: '0:30-0:40', description: 'Walking. Oats. "That\'s a shakedown."', needsVideo: true,
    videoPrompt: 'Tracking shot two men walking NYC sidewalk morning light, one rumpled oxford, other in Patagonia vest holding mason jar eating with spoon, talk animatedly, warm golden hour, steadicam, 24fps, anamorphic',
    dialogue: [{ character: 'Jerry', line: "That's not a commission structure, Kevin. That's a shakedown.", direction: 'deadpan, chewing oats' }]},
  { id: 't06', label: 'T-06', heading: 'Bridges Collect Tolls', type: 'CLOSE', timecode: '0:40-0:45', description: 'Jerry spoon point. THE quotable.', needsVideo: true,
    videoPrompt: 'Medium close-up man in Patagonia vest pointing long spoon at camera with conviction, mason jar in other hand, city sidewalk blurred, morning sun, deadpan, cinematic, 24fps, film grain',
    dialogue: [{ character: 'Jerry', line: 'Bridges also collect tolls.', direction: 'spoon point, absolute conviction' }]},
  { id: 't07', label: 'T-07', heading: 'Carly \u2014 "No."', type: 'MEDIUM', timecode: '0:45-0:48', description: 'Phone. "No." before Kevin speaks.', needsVideo: true,
    videoPrompt: 'Medium shot woman early 40s at cluttered law desk, tailored blazer, reading glasses on head, picks up ringing phone with reluctance, fluorescent mixed with desk lamp, almonds on desk, 24fps, film grain',
    dialogue: [
      { character: 'Carly', line: 'No.', direction: 'before Kevin speaks' },
      { character: 'Kevin', line: "I haven't asked yet.", direction: 'V.O., phone' }
    ]},
  { id: 't08', label: 'T-08', heading: 'Olive Garden', type: 'CLOSE', timecode: '0:48-0:55', description: 'Rapid-fire. American institution.', needsVideo: false, videoPrompt: null,
    dialogue: [
      { character: 'Carly', line: 'You owe me dinner. A real dinner.', direction: 'controlled fury' },
      { character: 'Kevin', line: 'That was Olive Garden. Olive Garden is an American institution.', direction: 'genuinely believes it' },
      { character: 'Carly', line: "Don't ever call it that again.", direction: 'quiet, lethal' }
    ]},
  { id: 't09', label: 'T-09', heading: 'Carly Drafting', type: 'WIDE', timecode: '0:55-1:05', description: 'Night. Todd asleep. Muttering builds.', needsVideo: true,
    videoPrompt: 'Wide shot woman in blazer and pajama pants typing at home desk at night, man sleeps on couch background, single desk lamp, mutters while typing, frustration, slow dolly-in, 24fps, film grain',
    dialogue: [{ character: 'Carly', line: 'When will he make me money...', direction: 'the quietest whisper' }]},
  { id: 't10', label: 'T-10', heading: 'DocuSign Confetti', type: 'INSERT', timecode: '1:05-1:08', description: 'All parties have signed!', needsVideo: true,
    videoPrompt: 'Close-up laptop screen showing email notification with confetti, room lighting reflected, smile forming in screen reflection, shallow depth of field, 24fps',
    dialogue: [] },
  { id: 't11', label: 'T-11', heading: 'Signature Page', type: 'INSERT', timecode: '1:08-1:12', description: 'Party 1-4. Jerry missing. Music drops.', needsVideo: false, videoPrompt: null, dialogue: [] },
  { id: 't12', label: 'T-12', heading: '"Who the hell is Alyx?"', type: 'MEDIUM', timecode: '1:12-1:18', description: 'Jerry kitchen. Stops making oats.', needsVideo: true,
    videoPrompt: 'Medium shot man in vest in home kitchen, scooping oats, phone between shoulder and ear, expression shifts to outrage, warm kitchen lighting, 24fps, film grain',
    dialogue: [{ character: 'Jerry', line: 'Who the hell is Alyx?', direction: 'stops making oats' }]},
  { id: 't13', label: 'T-13', heading: 'PENTAGONS ARE IRREGULAR', type: 'VFX', timecode: '1:18-1:30', description: 'iMessage exchange. Typing dots.', needsVideo: false, videoPrompt: null, dialogue: [] },
  { id: 't14', label: 'T-14', heading: '12% Title Card', type: 'VFX', timecode: '1:30-1:35', description: 'Full screen "12%". Horror energy.', needsVideo: false, videoPrompt: null,
    dialogue: [{ character: 'Kevin', line: 'Twelve percent.', direction: 'flat, stunned' }]},
  { id: 't15', label: 'T-15', heading: 'Queen of England', type: 'MEDIUM', timecode: '1:35-1:42', description: 'Walking. Fast exchange. Spoon point.', needsVideo: true,
    videoPrompt: 'Medium tracking shot two men walking briskly on city sidewalk, quick exchange, deadpan, overcast, faster pace, cinematic 24fps, anamorphic, film grain',
    dialogue: [
      { character: 'Jerry', line: "If that buyer's real, I'm the Queen of England.", direction: 'deadpan' },
      { character: 'Kevin', line: 'The Queen of England is dead, Jerry.', direction: 'matter of fact' },
      { character: 'Jerry', line: 'Exactly my point.', direction: 'spoon point' }
    ]},
  { id: 't16', label: 'T-16', heading: 'Days Passing', type: 'MONTAGE', timecode: '1:42-1:50', description: 'Monday. Tuesday. Wednesday. Silence.', needsVideo: true,
    videoPrompt: 'Montage man checking phone across different times, morning to evening, each shot more desaturated, intercut empty email inbox, time-lapse feeling, 24fps',
    dialogue: [] },
  { id: 't17', label: 'T-17', heading: 'Moe \u2014 LIRR Reveal', type: 'CLOSE', timecode: '1:50-1:58', description: 'Stripped of polish. "Judy lost her bag."', needsVideo: true,
    videoPrompt: 'Close-up man in loosened charcoal suit, all polish gone, speaking into phone, late afternoon long shadows, the face of a man delivering news he can barely believe, shallow depth of field, 24fps',
    dialogue: [
      { character: 'Moe', line: 'We have a problem.', direction: 'no polish, first time' },
      { character: 'Moe', line: 'Judy lost her bag. On the LIRR.', direction: 'barely believes it' }
    ]},
  { id: 't18', label: 'T-18', heading: 'The LIRR', type: 'WIDE', timecode: '1:58-2:03', description: 'Train pulling out. Indifferent. Eternal.', needsVideo: true,
    videoPrompt: 'Wide shot Long Island Rail Road train pulling out of Penn Station, morning light, platform emptying, fluorescent lights, documentary-style, 24fps, slightly desaturated, the train is indifferent',
    dialogue: [] },
  { id: 't19', label: 'T-19', heading: '"Was there ever a seller?"', type: 'CLOSE', timecode: '2:03-2:08', description: 'Kevin. Detective energy.', needsVideo: true,
    videoPrompt: 'Extreme close-up man late 30s speaking slowly into phone, already knows the answer, warm side lighting, camera still and intimate, 24fps, film grain',
    dialogue: [{ character: 'Kevin', line: 'Moe. Was there ever a seller?', direction: 'slow, already knowing' }]},
  { id: 't20', label: 'T-20', heading: 'Moe \u2014 Silence', type: 'CLOSE', timecode: '2:08-2:12', description: '3 seconds. No sound. Recalibrating.', needsVideo: true,
    videoPrompt: 'Extreme close-up well-dressed man eyes closed processing, jaw tightens, opens eyes with resolve, single warm side light dramatic shadows, hold 5 seconds, completely still, 24fps',
    dialogue: [] },
  { id: 't21', label: 'T-21', heading: 'Epilogue Flashes', type: 'MONTAGE', timecode: '2:12-2:20', description: 'LinkedIn. Pentagon plaque. 2%.', needsVideo: false, videoPrompt: null, dialogue: [] },
  { id: 't22', label: 'T-22', heading: '"What kind of block?"', type: 'MEDIUM', timecode: '2:20-2:30', description: 'Kevin. Phone. Camera look. Full circle.', needsVideo: true,
    videoPrompt: 'Medium shot man alone at kitchen table with coffee, morning light, phone buzzes, looks at camera briefly, then answers, warm domestic, ending and beginning simultaneously, 24fps',
    dialogue: [{ character: 'Kevin', line: 'What kind of block?', direction: 'same tone as opening, learned nothing' }]},
  { id: 't23', label: 'T-23', heading: 'THE BLOCK', type: 'VFX', timecode: '2:30-2:35', description: 'Title card. "It never is. But what if?"', needsVideo: false, videoPrompt: null, dialogue: [] },
  { id: 't24', label: 'T-24', heading: 'Tag', type: 'VFX', timecode: '2:35-2:42', description: 'No oats were enjoyed in the making of this film.', needsVideo: false, videoPrompt: null, dialogue: [] },
];

export const SCORE_SEGMENTS = [
  { id: 's1', name: 'Opening \u2014 Cool Confidence', timecode: '0:00-0:45',
    mood: 'Confident jazz. The deal is fresh. Everything is possible.',
    prompt: 'Cool jazz piano trio, confident walking bass, brushed drums, smooth saxophone accents, cinematic underscore, warm and optimistic, Vince Guaraldi meets film noir, 108bpm, 45 seconds' },
  { id: 's2', name: 'Middle \u2014 Creeping Doubt', timecode: '0:45-1:30',
    mood: 'Jazz starts to feel slightly off. Notes hold too long. Bass walks in minor key.',
    prompt: 'Jazz piano trio becoming uneasy, notes slightly off-key, walking bass shifting to minor key, brushed drums getting hesitant, cinematic tension building, comedy-drama underscore, 104bpm, 45 seconds' },
  { id: 's3', name: 'Collapse \u2014 The LIRR', timecode: '1:30-2:12',
    mood: "Jazz deteriorates. Piano plays wrong notes and doesn't correct. Drums lose time.",
    prompt: 'Jazz piano trio falling apart, wrong notes uncorrected, drums losing time signature, bass wandering aimlessly, cinematic decay, the sound of competence dissolving, sparse and lonely, 96bpm slowing, 42 seconds' },
  { id: 's4', name: 'Epilogue \u2014 Full Circle', timecode: '2:12-2:42',
    mood: "Original confident theme returns perfectly. He learned nothing. The jazz doesn't know what happened.",
    prompt: 'Cool jazz piano trio returning to full confidence, walking bass strong and sure, brushed drums perfectly in time, the same opening theme repeated with no awareness of what happened, warm optimistic cinematic jazz, 108bpm, 30 seconds' },
];
