import { CronJob } from "cron";
import { elasticSearch } from "../helpers/elasticsearch";
import { ELASTIC_LOGS_PREFIX } from "../config";
import ms from "ms";

export default () => {
  new CronJob(
    "0 0 * * *",
    async () => {
      await deleteOldLogs();
    },
    undefined,
    true
  );
};

const deleteOldLogs = async () => {
  return await elasticSearch.deleteByQuery({
    index: `${ELASTIC_LOGS_PREFIX}*`,
    body: {
      query: {
        bool: {
          must: [
            {
              range: {
                date: {
                  lte: new Date(new Date().getTime() - ms("92 days"))
                }
              }
            }
          ]
        }
      }
    }
  });
};
