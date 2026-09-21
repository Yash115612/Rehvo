/**
 * REHVO AI Tour™ — Multilingual Smart AI Tour Guide
 * Parses English, Hindi, and Hinglish voice/text commands to drive
 * interactive camera teleportation, lighting changes, and property QA.
 */

import { VoiceCommandResult, SunlightTime } from '../../types/tour';

export function parseVoiceTourCommand(
  rawTranscript: string,
  availableRooms: { id: string; name: string; type: string }[]
): VoiceCommandResult {
  const query = rawTranscript.toLowerCase().trim();

  // 1. Balcony intents
  if (
    query.includes('balcony') ||
    query.includes('balkani') ||
    query.includes('balconey') ||
    query.includes('terrace') ||
    query.includes('deck') ||
    query.includes('balcony kholo') ||
    query.includes('balcony dikhao')
  ) {
    const target = availableRooms.find((r) => r.type === 'balcony' || r.type === 'terrace') || availableRooms[0];
    return {
      action: 'teleport',
      target_room_id: target.id,
      target_room_name: target.name,
      speech_reply: `Teleporting to ${target.name}. Enjoy the Arabian Sea deck view.`,
      confidence: 0.98,
    };
  }

  // 2. Kitchen intents
  if (
    query.includes('kitchen') ||
    query.includes('rasoi') ||
    query.includes('kitchen dikhao') ||
    query.includes('cooking') ||
    query.includes('gas')
  ) {
    const target = availableRooms.find((r) => r.type === 'kitchen') || availableRooms[0];
    return {
      action: 'teleport',
      target_room_id: target.id,
      target_room_name: target.name,
      speech_reply: `Opening ${target.name}. Fitted with Italian granite and gas pipeline.`,
      confidence: 0.98,
    };
  }

  // 3. Bedroom intents
  if (
    query.includes('bedroom') ||
    query.includes('bed room') ||
    query.includes('master') ||
    query.includes('kamra') ||
    query.includes('bedroom dikhao') ||
    query.includes('sone ka kamra')
  ) {
    const target =
      availableRooms.find((r) => r.type === 'master_bedroom') ||
      availableRooms.find((r) => r.type.includes('bedroom')) ||
      availableRooms[0];

    return {
      action: 'teleport',
      target_room_id: target.id,
      target_room_name: target.name,
      speech_reply: `Taking you to ${target.name}. Features 252 sq.ft carpet area.`,
      confidence: 0.97,
    };
  }

  // 4. Bathroom intents
  if (
    query.includes('bathroom') ||
    query.includes('toilet') ||
    query.includes('washroom') ||
    query.includes('bath') ||
    query.includes('gusal khana')
  ) {
    if (query.includes('how many') || query.includes('kitne') || query.includes('count')) {
      const bathCount = availableRooms.filter((r) => r.type === 'bathroom').length || 2;
      return {
        action: 'info',
        speech_reply: `This property has ${bathCount} verified modern bathrooms, including a master ensuite with premium fittings.`,
        confidence: 0.95,
      };
    }
    const target = availableRooms.find((r) => r.type === 'bathroom') || availableRooms[0];
    return {
      action: 'teleport',
      target_room_id: target.id,
      target_room_name: target.name,
      speech_reply: `Here is the ${target.name} with anti-skid tiles and premium glass partitions.`,
      confidence: 0.96,
    };
  }

  // 5. Living room intents
  if (
    query.includes('living') ||
    query.includes('hall') ||
    query.includes('drawing') ||
    query.includes('baithak') ||
    query.includes('hall dikhao')
  ) {
    const target = availableRooms.find((r) => r.type === 'living') || availableRooms[0];
    return {
      action: 'teleport',
      target_room_id: target.id,
      target_room_name: target.name,
      speech_reply: `Welcome back to the ${target.name}. 352 sq.ft with 10.5 ft ceiling height.`,
      confidence: 0.98,
    };
  }

  // 6. Sunlight / lighting mode intents
  if (
    query.includes('sunlight') ||
    query.includes('dhoop') ||
    query.includes('golden hour') ||
    query.includes('shaam') ||
    query.includes('morning') ||
    query.includes('subah') ||
    query.includes('night') ||
    query.includes('raat')
  ) {
    let mode: SunlightTime = 'golden_hour';
    let label = 'Golden Hour';
    if (query.includes('morning') || query.includes('subah')) {
      mode = 'morning';
      label = 'Morning Sunrise';
    } else if (query.includes('night') || query.includes('raat') || query.includes('light')) {
      mode = 'night';
      label = 'Night Ambience';
    } else if (query.includes('afternoon') || query.includes('dopahar')) {
      mode = 'afternoon';
      label = 'Afternoon Daylight';
    }

    return {
      action: 'sunlight',
      sunlight_mode: mode,
      speech_reply: `Switching to ${label} simulation. Notice the natural illumination from the West windows.`,
      confidence: 0.94,
    };
  }

  // 7. Measure tool intents
  if (
    query.includes('measure') ||
    query.includes('naap') ||
    query.includes('distance') ||
    query.includes('size') ||
    query.includes('dimension')
  ) {
    return {
      action: 'measure',
      speech_reply: 'AR Measure Tool active. Tap any two points on the screen to calculate real-world distance in feet and meters.',
      confidence: 0.96,
    };
  }

  // 8. Furniture removal / empty room intents
  if (
    query.includes('empty') ||
    query.includes('unfurnished') ||
    query.includes('khali') ||
    query.includes('bina furniture') ||
    query.includes('remove furniture')
  ) {
    return {
      action: 'furniture_toggle',
      speech_reply: 'Toggling AI Unfurnished Mode. Visualizing empty room walls and flooring.',
      confidence: 0.95,
    };
  }

  // Default fallback
  return {
    action: 'info',
    speech_reply: `I can show you the Living Room, Kitchen, Master Suite, Balcony, or simulate sunlight. What would you like to explore?`,
    confidence: 0.75,
  };
}
