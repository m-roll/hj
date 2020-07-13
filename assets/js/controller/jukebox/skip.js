export default class SkipController {
  constructor(skipDetailsProviderThunk, skipDetailsView) {
    this.skipDetailsProviderThunk = skipDetailsProviderThunk;
    this.skipDetailsView = skipDetailsView;
  }
  ready() {
    this._setupListeners();
  }
  _setupListeners() {
    this.skipDetailsProviderThunk().onSkipStateUpdate(((update) => {
      console.log("Skips updated", update);
      this.skipDetailsView.setSkipValues(update.num_skips, update.skips_needed);
    }).bind(this));
    this.skipDetailsView.onSkipRequest(() => {
      this.skipDetailsProviderThunk().voteSkip();
    });
  }
}