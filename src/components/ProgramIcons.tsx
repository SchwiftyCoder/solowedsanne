// Small line-art badge icons for each event on the wedding program timeline,
// drawn in the same 24x24 stroke style as WeddingMotifs' CalendarIcon/PinIcon.
type IconProps = { color?: string };

export function FamilyIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="7" r="2.2" stroke={color} strokeWidth="1.4" />
      <circle cx="12" cy="5.5" r="2.5" stroke={color} strokeWidth="1.4" />
      <circle cx="18" cy="7" r="2.2" stroke={color} strokeWidth="1.4" />
      <path d="M2.5 18.5C2.5 14.8 4 12.7 6 12.7C7.2 12.7 8.2 13.3 8.8 14.4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M21.5 18.5C21.5 14.8 20 12.7 18 12.7C16.8 12.7 15.8 13.3 15.2 14.4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7.5 19.5C7.5 15.9 9.3 13.5 12 13.5C14.7 13.5 16.5 15.9 16.5 19.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function GiftIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="9.5" width="17" height="10" rx="1" stroke={color} strokeWidth="1.4" />
      <path d="M3.5 13H20.5" stroke={color} strokeWidth="1.4" />
      <path d="M12 9.5V19.5" stroke={color} strokeWidth="1.4" />
      <path d="M12 9.5C12 9.5 8.5 9.5 7.5 7.5C6.8 6.1 8.3 4.7 9.7 5.5C11.3 6.4 12 9.5 12 9.5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12 9.5C12 9.5 15.5 9.5 16.5 7.5C17.2 6.1 15.7 4.7 14.3 5.5C12.7 6.4 12 9.5 12 9.5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function BridesmaidsIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="5.5" r="2" stroke={color} strokeWidth="1.3" />
      <path d="M8 8C5.5 8 4 11.5 4.8 16.5C5.1 18.3 6.4 19.5 8 19.5C9.6 19.5 10.9 18.3 11.2 16.5C12 11.5 10.5 8 8 8Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="16.5" cy="7" r="1.8" stroke={color} strokeWidth="1.3" />
      <path d="M16.5 9.3C14.5 9.3 13.3 12.2 14 16.4C14.2 17.8 15.2 18.8 16.5 18.8C17.8 18.8 18.8 17.8 19 16.4C19.7 12.2 18.5 9.3 16.5 9.3Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function BrideIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3C9.5 5 8 8 8 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 3C14.5 5 16 8 16 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="12" cy="6" r="2.3" stroke={color} strokeWidth="1.4" />
      <path d="M12 8.3C8 8.3 5.5 13 6.5 18.5C6.8 19.8 7.9 20.5 9 20.5H15C16.1 20.5 17.2 19.8 17.5 18.5C18.5 13 16 8.3 12 8.3Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9.5 12.5C10.5 13.5 13.5 13.5 14.5 12.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function HandshakeIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 11L7 7.5C7.7 7 8.7 7 9.3 7.6L11 9.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.5 11L17 7.5C16.3 7 15.3 7 14.7 7.6L13 9.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13.2L11.2 15.3C11.9 16 13 16 13.6 15.3C14.3 14.6 14.3 13.5 13.6 12.8L11.4 10.7C10.8 10.1 9.9 10.1 9.3 10.6L7 12.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 11L6.5 15.2C7.2 15.9 8.3 15.9 9 15.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.5 11L17.5 15.2C16.8 15.9 15.7 15.9 15 15.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RingsIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="14" r="5" stroke={color} strokeWidth="1.4" />
      <circle cx="15" cy="14" r="5" stroke={color} strokeWidth="1.4" />
      <path d="M9 9L8 5.5L9.7 4.3L11.4 5.5L10.4 9" stroke={color} strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

export function CameraIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6.5L10 4.5H14L15 6.5H19C20.1 6.5 21 7.4 21 8.5V17.5C21 18.6 20.1 19.5 19 19.5H5C3.9 19.5 3 18.6 3 17.5V8.5C3 7.4 3.9 6.5 5 6.5H9Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.4" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

export function ToastIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 3.5H10.5L9.5 12C9.5 13.4 8.4 14.5 7 14.5C5.9 14.5 5 13.6 5 12.5V12L5.5 3.5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" transform="rotate(-18 7 9)" />
      <path d="M13.5 3.5H18.5L19 12V12.5C19 13.6 18.1 14.5 17 14.5C15.6 14.5 14.5 13.4 14.5 12L13.5 3.5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" transform="rotate(18 17 9)" />
      <path d="M6 18.5H8.5M17 18.5H15" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function DinnerIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3.5V10C6 11.1 6.9 12 8 12V20.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 3.5V8.5M8 3.5V8.5M10 3.5V8.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M18 3.5C16 4 15 6 15 8.5C15 10 15.7 11 17 11.3V20.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function OutfitIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="4.2" r="1.3" stroke={color} strokeWidth="1.2" />
      <path d="M12 5.5L3.5 11.5C2.9 11.9 3.1 12.9 3.9 12.9H20.1C20.9 12.9 21.1 11.9 20.5 11.5L12 5.5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 12.9L5 20.5H19L18 12.9" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function CurtainIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4H21" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.5 4C4.5 4 7 8 5.5 20" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 4C9 4 10.5 9 8.5 20" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M15 4C15 4 13.5 9 15.5 20" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M19.5 4C19.5 4 17 8 18.5 20" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CoupleIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="5.5" r="2" stroke={color} strokeWidth="1.3" />
      <path d="M7 7.8C4.8 7.8 3.5 11 4.2 15.5C4.4 16.7 5.4 17.5 6.6 17.5H7.4C8.6 17.5 9.6 16.7 9.8 15.5C10.5 11 9.2 7.8 7 7.8Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="17" cy="5.5" r="2" stroke={color} strokeWidth="1.3" />
      <path d="M17 8.2C15.3 8.2 14 9.3 14 11V17.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 8.2C18.3 8.2 17 9.3 17 11V17.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 11H19.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function MusicIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="18" r="2.3" stroke={color} strokeWidth="1.4" />
      <circle cx="17" cy="16" r="2.3" stroke={color} strokeWidth="1.4" />
      <path d="M9.3 18V6.5L19.3 4.5V16" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.3 9.5L19.3 7.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ color = '#B8860B' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 20.3C12 20.3 3 15 3 8.7C3 5.8 5.2 3.5 8 3.5C9.7 3.5 11.1 4.4 12 5.7C12.9 4.4 14.3 3.5 16 3.5C18.8 3.5 21 5.8 21 8.7C21 15 12 20.3 12 20.3Z"
        stroke={color} strokeWidth="1.4" strokeLinejoin="round"
      />
    </svg>
  );
}

export const PROGRAM_ICONS = {
  family: FamilyIcon,
  gift: GiftIcon,
  bridesmaids: BridesmaidsIcon,
  bride: BrideIcon,
  handshake: HandshakeIcon,
  rings: RingsIcon,
  camera: CameraIcon,
  toast: ToastIcon,
  dinner: DinnerIcon,
  outfit: OutfitIcon,
  curtain: CurtainIcon,
  couple: CoupleIcon,
  music: MusicIcon,
  heart: HeartIcon,
} as const;

export type ProgramIconKey = keyof typeof PROGRAM_ICONS;
