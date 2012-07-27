package my.webapp.workman.bo;

public class TextNote extends Data {
	private String text;
	private NoteEntry noteEntry;
	
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public void setNoteEntry(NoteEntry noteEntry) {
		this.noteEntry = noteEntry;
	}
	public NoteEntry getNoteEntry() {
		return noteEntry;
	}
}
