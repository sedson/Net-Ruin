// Data helper for the processing portion of the project
// matches a pixel color to a class name
StringDict buildColorTable () {
  StringDict table = new StringDict();
  // Basic tiles
  table.set("000000", "Void");
  table.set("E59281", "Sand");
  table.set("B66F60", "Soil");
  table.set("E7EBEE", "Snow");
  table.set("C2ADA9", "Ash");
  table.set("31CD9F", "Sludge");
  table.set("32DC3A", "Terra");
  table.set("818487", "Path");

  // Blocking tiles
  table.set("CE2DF7", "Ruin");
  table.set("FF0000", "Wall");
  table.set("5B5554", "Rock");
  table.set("575ABB", "Water");

  // Special interaction tiles
  table.set("0041E5", "TradingPost");
  table.set("FFCC00", "Club");
  table.set("197825", "Guide");

  return table;
}
