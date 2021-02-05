// This processing sketch will convert an image into a JavaScript data file
//   • Once we learn a bit of back end it would be great to convert this to a node module 
//     that could run on server. 

String outputDir = "../js/";
String fileName = "map.js";

String inputTexture = "maptext.gif";

void setup(){
  // Initialize a filewriter
  PrintWriter output = createWriter(outputDir + fileName);
  
  // Load the map image
  PImage data = loadImage(inputTexture);
  
  // make the lookup table
  StringDict lookUpTable = buildColorTable();
  
  output.println("const map = ["); // first line of the data
  
  for(int i = 0; i < data.height; i++){
    String line = "\t[";
    for(int j = 0; j < data.width; j++){
      String val = hex(data.get(j, i), 6); // convert the pixel into hex string
      println(val);
      line += lookUpTable.hasKey(val) ? "\"" + lookUpTable.get(val) + "\"" : "\"Empty\"";
       
      if(j < data.width - 1) line += ",";
    }
    line += "]";
    if(i < data.height - 1) line += ",";
    output.println(line);
  }
  output.println("]");
  output.flush(); // Writes the remaining data to the file
  output.close(); // Finishes the file
  exit(); // closed the program
}
