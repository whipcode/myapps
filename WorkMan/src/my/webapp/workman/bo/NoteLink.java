package my.webapp.workman.bo;

public class NoteLink extends Data {
	private NoteEntry noteEntry;
	private int objectType;
	private int objectId;
	
	public void setNoteEntry(NoteEntry noteEntry) {
		this.noteEntry = noteEntry;
	}
	public NoteEntry getNoteEntry() {
		return noteEntry;
	}
	public void setObjectType(int objectType) {
		this.objectType = objectType;
	}
	public int getObjectType() {
		return objectType;
	}
	public void setObjectId(int objectId) {
		this.objectId = objectId;
	}
	public int getObjectId() {
		return objectId;
	}
}
