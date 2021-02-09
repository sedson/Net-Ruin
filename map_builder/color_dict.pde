// Data helper for the processing portion of the pipeline
StringDict buildColorTable () {
  StringDict table = new StringDict();
  table.set("000000", "Void");
  table.set("FF0000", "Wall");
  table.set("FFCC00", "Door");
  table.set("0041E5", "TradingPost");
  table.set("E59281", "Soil");
  table.set("B66F60", "Sand");
  table.set("54AF58", "Grass");
  table.set("197825", "Guide");
  return table;
}
