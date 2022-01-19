// Extends the app state to include the sample feature.
// This is required because samples are lazy loaded.
// So the reference to sampleState cannot be added to app.state.ts directly.

export interface State {
  isNavigating: boolean;
}
