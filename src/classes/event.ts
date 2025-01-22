import type { Categories, EventOptions } from "../interfaces/files.types.js";

export class Event<Category extends Categories = Categories> {
  constructor(private readonly eventOptions: EventOptions<Category>) {
    this.eventOptions.categoryName = eventOptions.categoryName;
    this.eventOptions.execute = eventOptions.execute;
  }

  public get categoryName() {
    return this.eventOptions.categoryName;
  }

  public get execute() {
    return this.eventOptions.execute;
  }
}