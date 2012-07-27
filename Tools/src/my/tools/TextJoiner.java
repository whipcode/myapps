package my.tools;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;

public class TextJoiner {
	private String inFile;
	private String outFile;

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		TextJoiner joiner = new TextJoiner("in.txt","out.txt");
		joiner.join();
	}
	
	TextJoiner(String inFile, String outFile)
	{
		this.inFile = inFile;
		this.outFile = outFile;
	}

	public void join() throws Exception
	{
		BufferedReader in = new BufferedReader(new FileReader(inFile));
		BufferedWriter out = new BufferedWriter(new FileWriter(outFile));
		String text;
		int numLines = 0;
		
		while ((text = in.readLine()) != null)
		{
			if (!text.equals(""))
			{
				if (text.charAt(0) == ' ')
					out.write("\r\n");
				
				out.write(text);
			}
		}
		
		in.close();
		out.close();
	}
}
