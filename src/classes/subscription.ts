import { wait } from "../functions/general.js";
import { getCategory, type ArticleData } from "../functions/http.js";

export type ExecuteFunction = (article: ArticleData) => Awaited<void>;

export class Subscription {
  /**
   * Creates a new subscription instance.
   * 
   * @param {string} id - The unique identifier for the subscription.
   */
  constructor(readonly id: string) {}

  /**
   * Checks for the latest article and executes the provided function if a new article is found.
   * 
   * @param {ExecuteFunction} func - A callback function that is executed with the latest article.
   * @param {number} [lastTime=0] - The timestamp of the last checked article. Defaults to 0.
   * @returns {Promise<void>} A promise that resolves after checking and scheduling the next check.
   */
  public async checkAndSendLastArticle(func: ExecuteFunction, lastTime = 0): Promise<void> {
    const article = await this.getLastArticle();

    if (lastTime === 0) {
      func(article);
    } else if (lastTime !== article.published) {
      func(article);
    }

    await this.recheck(func, article.published);
  }

  /**
   * Waits for a specified interval and then rechecks for new articles.
   * 
   * @param {ExecuteFunction} func - A callback function that processes the latest article.
   * @param {number} time - The timestamp of the last checked article.
   * @returns {Promise<void>} A promise that resolves after waiting and rechecking.
   */
  public async recheck(func: ExecuteFunction, time: number): Promise<void> {
    await wait(60 * 1000);
    await this.checkAndSendLastArticle(func, time);
  };

  /**
   * Fetches the latest articles for the current subscription.
   * 
   * @returns {Promise<ArticleData[]>} A promise that resolves with an array of article data.
   */
  public async getArticles(): Promise<ArticleData[]> {
    const articles = (await getCategory(this.id));
    return articles;
  }

  /**
   * Retrieves the most recent article. If no article is found, retries after a delay.
   * 
   * @returns {Promise<ArticleData>} A promise that resolves with the latest article data.
   */
  public async getLastArticle(): Promise<ArticleData> {
    const last = (await this.getArticles())[0];
    if (!last) {
      await wait(15 * 1000);
      return await this.getLastArticle();
    }

    return last;
  }
}