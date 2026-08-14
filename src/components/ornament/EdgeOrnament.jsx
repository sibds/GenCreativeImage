import UiOrnament from './UiOrnament';

export default function EdgeOrnament() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden print:hidden" aria-hidden="true">           
      <UiOrnament
        variant="v1"
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 lg:block"
      />
      <UiOrnament
        variant="v1"
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 lg:block"
      />
    </div>
  );
}
