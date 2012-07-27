package my.webapp.workman.bo;

import java.util.HashSet;
import java.util.Set;

public class NoteEntry extends Data {
	public static final class TYPE {
		public static final int TEXT_NOTE = 0;
	};
	
	private String title;
	private int type;
	private JobFile jobfile;
	private Set<NoteLink> links = new HashSet<NoteLink>();
	
	/* It is intentionally not include a link to the actual content.
	 * Additional query is required when getting the actual content, to minimize 
	 * data transfer over the network during query of the noteEntris of one jobfile. */
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public JobFile getJobfile() {
		return jobfile;
	}
	public void setJobfile(JobFile jobfile) {
		this.jobfile = jobfile;
	}
	public void setLinks(Set<NoteLink> links) {
		this.links = links;
	}
	public Set<NoteLink> getLinks() {
		return links;
	}
}
