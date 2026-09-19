import {cloudLeaderboard} from '../scripts/cloud-leaderboard.mjs';
import {scoreHandler} from '../scripts/leaderboard-api.mjs';
export default scoreHandler(cloudLeaderboard());
