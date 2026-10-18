export interface WhatsAppMessage {
  sender: 'customer' | 'seller';
  text: string;
  time: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  photoUrl?: string;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  phoneMasked: string;
  location: string;
  vehicle: string;
  date: string;
  avatarColor: string;
  initials: string;
  headline: string;
  messages: WhatsAppMessage[];
  verifiedDelivery: boolean;
}

export const WHATSAPP_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    customerName: 'Engr. Babatunde O.',
    phoneMasked: '0803 *** 4912',
    location: 'Ikeja, Lagos State',
    vehicle: '2008 Toyota Camry (Muscle)',
    date: 'Yesterday at 3:45 PM',
    avatarColor: 'bg-emerald-600',
    initials: 'BO',
    headline: 'Fixed 6 months of intermittent stalling in Third Mainland traffic',
    verifiedDelivery: true,
    messages: [
      {
        sender: 'customer',
        text: 'Boss good afternoon! I wanted to give you quick feedback on the Frankblaise fuel pump you sent to Ikeja on Tuesday.',
        time: '3:42 PM',
      },
      {
        sender: 'customer',
        text: 'My mechanic just finished fixing it into my Camry Muscle. The car cranked ONCE and ignited immediately! Normally in traffic when the engine gets hot, the previous pump would shut down. Drove for 2 hours today on Ikorodu road, cold AC on, no single hesitation!',
        time: '3:44 PM',
      },
      {
        sender: 'customer',
        text: 'Voice message (0:38)',
        time: '3:45 PM',
        isVoiceNote: true,
        voiceDuration: '0:38',
      },
      {
        sender: 'seller',
        text: 'Awesome to hear Engineer Babatunde! That heavy-duty copper coil handles Nigerian traffic heat effortlessly. Keep the 1-year warranty card safe in your glove compartment. Thank you for choosing FRANKBLAISE PARTS! 🙏🚗',
        time: '3:48 PM',
      },
    ],
  },
  {
    id: 'rev-2',
    customerName: 'Chief Emeka Nwankwo',
    phoneMasked: '0814 *** 8831',
    location: 'Port Harcourt, Rivers State',
    vehicle: '2012 Lexus RX350',
    date: 'Wednesday at 11:20 AM',
    avatarColor: 'bg-blue-600',
    initials: 'EN',
    headline: 'Pay on delivery made me trust them. Extremely quiet pump!',
    verifiedDelivery: true,
    messages: [
      {
        sender: 'customer',
        text: 'Hello Frankblaise team. The dispatch rider brought the package to my office in Trans Amadi. I inspected the pump, seals, filter sock and clamps before making transfer. Everything 100% original as advertised.',
        time: '11:15 AM',
      },
      {
        sender: 'customer',
        text: 'Installed on my RX350 yesterday. The high-pitched buzzing noise from the old pump is completely GONE. Acceleration on East-West road is sharp now.',
        time: '11:18 AM',
      },
      {
        sender: 'seller',
        text: 'Thank you Chief! That is the whisper-quiet turbine impeller doing its job. We only stock the original Frankblaise Electric Fuel Pump Plus.',
        time: '11:22 AM',
      },
      {
        sender: 'customer',
        text: 'I am ordering one more for my wife’s Corolla. Let me use the double pack package.',
        time: '11:24 AM',
      },
    ],
  },
  {
    id: 'rev-3',
    customerName: 'Alhaji Musa Garba',
    phoneMasked: '0902 *** 1194',
    location: 'Garki 2, Abuja (FCT)',
    vehicle: '2010 Honda Accord (Evil Spirit)',
    date: '14 Oct at 5:12 PM',
    avatarColor: 'bg-amber-600',
    initials: 'MG',
    headline: 'No more starting delays in cold Abuja mornings or hot afternoons',
    verifiedDelivery: true,
    messages: [
      {
        sender: 'customer',
        text: 'Salam brother. The 2 fuel pumps arrived Abuja safely. Very fast dispatch.',
        time: '5:08 PM',
      },
      {
        sender: 'customer',
        text: 'My Honda had hard starting issues, I will crank 4 to 5 times before it kicks. Mechanic tested the line pressure after installing Frankblaise and it showed 4.0 Bar steady! Single kick now.',
        time: '5:10 PM',
      },
      {
        sender: 'seller',
        text: 'Wa alaykum salam Alhaji! That is the guaranteed 3.8-4.2 Bar line pressure. You will also notice smoother fuel economy. Appreciate your patronising us sir!',
        time: '5:14 PM',
      },
    ],
  },
  {
    id: 'rev-4',
    customerName: 'Kolawole Mechanic Works',
    phoneMasked: '0706 *** 5520',
    location: 'Ring Road, Ibadan, Oyo State',
    vehicle: 'Master Auto Technician (Fleet Specialist)',
    date: '12 Oct at 1:18 PM',
    avatarColor: 'bg-red-600',
    initials: 'KM',
    headline: 'As an auto-electrician with 15 years experience, this pump is solid',
    verifiedDelivery: true,
    messages: [
      {
        sender: 'customer',
        text: 'Good day Frankblaise Parts. I am an auto electrician in Ibadan. I tested the copper winding resistance and current draw on your pump with my multimeter. 5.1 Amps at full 12.8V, perfect armature specs.',
        time: '1:12 PM',
      },
      {
        sender: 'customer',
        text: 'Most cheap pumps in the market overheat within 30 minutes because they use aluminum coated wire. Yours is 100% heavy copper. I have installed 6 for my customers so far, zero comebacks.',
        time: '1:15 PM',
      },
      {
        sender: 'seller',
        text: 'Master Kolawole, thank you so much for this professional verification! Real technicians know the difference in winding quality. Glad to have you as a trade partner!',
        time: '1:20 PM',
      },
    ],
  },
  {
    id: 'rev-5',
    customerName: 'Sgt. Kenneth Umeh (Rtd.)',
    phoneMasked: '0812 *** 7741',
    location: 'Asaba, Delta State',
    vehicle: '2006 Toyota RAV4',
    date: '10 Oct at 4:30 PM',
    avatarColor: 'bg-purple-600',
    initials: 'KU',
    headline: 'Climbed Asaba expressway hill with full AC and zero choking',
    verifiedDelivery: true,
    messages: [
      {
        sender: 'customer',
        text: 'Frankblaise, package reached me at Asaba. Courier gave me time to check the box.',
        time: '4:22 PM',
      },
      {
        sender: 'customer',
        text: 'My RAV4 used to lose power when climbing steep expressway bridges, like fuel is not reaching the engine. Yesterday I took it on a long run to Benin and back. Power was uninterrupted. 5 stars.',
        time: '4:26 PM',
      },
      {
        sender: 'seller',
        text: 'Sir Kenneth, thank you for the feedback! The high-flow 150 LPH rate guarantees continuous fuel delivery under heavy load and uphill driving. Safe travels always!',
        time: '4:32 PM',
      },
    ],
  },
];
