// This processing sketch will convert an image into a JavaScript data file.
// Once we learn a bit of back end it would be great to convert this to a node module
// that could run on server.

String outputDir = "../data/";
String fileName = "testmap_data.js";

// processing expects images to be inside a dir called "data"
// and automatically finds them there
String inputTexture = "maptext.gif";

// setup is a processing builtin that runs once on program start
void setup(){
  // initialize a filewriter
  PrintWriter output = createWriter(outputDir + fileName);

  // load the map into an image
  PImage img = loadImage(inputTexture);

  // get the lookup table
  StringDict lookUpTable = buildColorTable();

  // exporting the file as raw JS for now -- so first line looks like this:
  output.println("const MAP_DATA = [");

  // loop over the pixels of the image
  // & check to see if the pixel color corresponds to a tile type (see color_dict.pde)
  for(int i = 0; i < img.height; i++){
    String line = "\t[";
    for(int j = 0; j < img.width; j++){
      // convert the pixel into hex string
      String hexVal = hex(img.get(j, i), 6);
      line += lookUpTable.hasKey(hexVal) ? "\"" + lookUpTable.get(hexVal) + "\"" : "\"Empty\"";
      if(j < img.width - 1) line += ",";
    }
    line += "]"; // close the internal array
    if(i < img.height - 1) line += ",";
    output.println(line);
  }
  output.println("]"); // close the array
  output.flush(); // write any extra data to the file
  output.close(); // finish the file
  exit(); // clos the program
}
