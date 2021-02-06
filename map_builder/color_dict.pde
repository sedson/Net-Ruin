// Data helper for the processing portion of the pipeline
StringDict buildColorTable () {
  StringDict table = new StringDict();
  table.set("000000", "Empty");
  table.set("FF0000", "Wall");
  table.set("54AF58", "Grass");
  table.set("0041E5", "Rock");
  table.set("E59281", "Soil");
  table.set("FFCC00", "Door");
  return table;
}
