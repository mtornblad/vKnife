export class Helpers {

  static splitAndTrim(stringToModify: string, splitter: string): string[] {
    var arr: string[] = stringToModify.split(splitter);
    arr.map(function (item) { return item.trim(); });
    return arr;
  }

}