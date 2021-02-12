// Data helper for the processing portion of the project
// matches a pixel color to a class name
StringDict buildColorTable () {
  StringDict table = new StringDict();
  table.set("000000", "Void");
  table.set("CE2DF7", "Ruin");
  table.set("FF0000", "Wall");
  table.set("FFCC00", "Door");
  table.set("0041E5", "TradingPost");
  table.set("E59281", "Sand");
  table.set("B66F60", "Soil");
  table.set("818487", "Path");
  table.set("31CD9F", "Sludge");
  table.set("54AF58", "Grass");
  table.set("197825", "Guide");
  return table;
}
