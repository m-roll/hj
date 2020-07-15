export default function SkipController(skipDetailsProviderThunk, skipDetailsView) {

  function ready() {
    _setupListeners();
    skipDetailsProviderThunk().getVoteStatus();
  }
  function _setupListeners() {
    skipDetailsProviderThunk().onSkipStateUpdate((update) => {
      skipDetailsView.setSkipValues(update.num_skips, update.skips_needed);
    });
    skipDetailsView.onSkipRequest(() => {
      skipDetailsProviderThunk().voteSkip();
    });
    skipDetailsView.onUnSkipRequest(() => {
      skipDetailsProviderThunk().unVoteSkip();
    });
    skipDetailsProviderThunk().onGetVoteStatus((resp) => {
      skipDetailsView.setHasVoted(resp.has_voted);
    });
  }

  return {
    ready
  }
}