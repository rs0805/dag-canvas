import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { LeftPalette, SelectionHint } from './leftPalette';

function App() {
  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        background: '#FAFAF8',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <PipelineUI />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <PipelineToolbar />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 96,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <SelectionHint />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 88,
          left: 16,
          zIndex: 10,
        }}
      >
        <LeftPalette />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <SubmitButton />
      </div>
    </div>
  );
}

export default App;
