import UiOrnament from './UiOrnament';

export default function EdgeOrnament() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden print:hidden" aria-hidden="true">
      <UiOrnament
        variant="h1"
        className="absolute top-[4.75rem] left-1/2 -translate-x-1/2"
      />
      <UiOrnament
        variant="h1"
        className="absolute bottom-3 left-1/2 -translate-x-1/2"
      />
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
