export default class SkipController {
  constructor(skipDetailsProviderThunk, skipDetailsView) {
    this.skipDetailsProviderThunk = skipDetailsProviderThunk;
    this.skipDetailsView = skipDetailsView;
  }
  ready() {
    this._setupListeners();
    this.skipDetailsProviderThunk().getVoteStatus();
  }
  _setupListeners() {
    this.skipDetailsProviderThunk().onSkipStateUpdate(((update) => {
      this.skipDetailsView.setSkipValues(update.num_skips, update.skips_needed);
    }).bind(this));
    this.skipDetailsView.onSkipRequest(() => {
      this.skipDetailsProviderThunk().voteSkip();
    });
    this.skipDetailsView.onUnSkipRequest(() => {
      this.skipDetailsProviderThunk().unVoteSkip();
    });
    this.skipDetailsProviderThunk().onGetVoteStatus(((resp) => {
      this.skipDetailsView.setHasVoted(resp.has_voted);
    }).bind(this));
  }
}