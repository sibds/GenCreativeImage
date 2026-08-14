import h1 from '../../assets/ui/h1.png';
import h2 from '../../assets/ui/h2.png';
import v1 from '../../assets/ui/v1.png';

const SOURCES = { h1, h2, v1 };

const SIZE = {
  h1: 'h-14 w-auto max-w-md',
  h2: 'h-8 w-auto max-w-xs',
  v1: 'h-[55vh] w-auto max-w-[5.5rem]',
};

export default function UiOrnament({ variant, className = '' }) {
  return (
    <img
      src={SOURCES[variant]}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={`object-contain ${SIZE[variant]} ${className}`}
    />
  );
}
