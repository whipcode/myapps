package my.webapp.workman.dao;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import my.webapp.workman.bo.DateEvent;
import my.webapp.workman.bo.Job;
import my.webapp.workman.bo.JobFile;
import my.webapp.workman.bo.JobStage;
import my.webapp.workman.bo.JobTask;
import my.webapp.workman.bo.NoteEntry;
import my.webapp.workman.bo.NoteLink;
import my.webapp.workman.bo.PublicHoliday;
import my.webapp.workman.bo.TextNote;
import my.webapp.workman.bo.TodayTask;
import my.webapp.workman.bo.WeekFocus;
import my.webapp.workman.bo.WeekTask;
import my.webapp.workman.so.JobmanPref;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Restrictions;

public class JobmanDao extends AbstractDwrDao{
	private Logger logger = Logger.getLogger(JobmanDao.class);
	
	public PublicHoliday savePublicHoliday(PublicHoliday publicHoliday) {
		logger.trace("savePublicHoliday()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(publicHoliday);
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
		return publicHoliday;
	}
	
	public JobFile saveJobFile(JobFile jobfile) {
		logger.trace("saveJobFile()");
		
		try {
			beginTranx();
			
			jobfile.setOwner(sessionUser);
			session.saveOrUpdate(jobfile);
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
		return jobfile;
	}
	
	public List<DateEvent> saveDateEvents(List<DateEvent> dateEvents) {
		logger.trace("saveDateEvents()");
		
		try {
			beginTranx();
			
			Iterator<DateEvent> itDateEvents = dateEvents.iterator();
			while (itDateEvents.hasNext()) {
				DateEvent dateEvent = itDateEvents.next();
				session.saveOrUpdate(dateEvent);
				logger.debug("Saving DateEvent id=" + dateEvent.getId());
			}
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
		
		return dateEvents;
	}
	
	public List<WeekFocus> saveWeekFocuses(List<WeekFocus> weekFocuses) {
		logger.trace("saveWeekFocuses()");
		
		try {
			beginTranx();
			
			Iterator<WeekFocus> itWeekFocuses = weekFocuses.iterator();
			while (itWeekFocuses.hasNext()) {
				WeekFocus weekFocus = itWeekFocuses.next();
				session.saveOrUpdate(weekFocus);
				logger.debug("Saving WeekFocus id=" + weekFocus.getId());
			}
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
		
		return weekFocuses;
	}
	
	public List<WeekTask> saveWeekTasks(List<WeekTask> weekTasks) {
		logger.trace("saveWeekTasks()");
		
		try {
			beginTranx();
			
			Iterator<WeekTask> itWeekTasks = weekTasks.iterator();
			while (itWeekTasks.hasNext()) {
				WeekTask weekTask = itWeekTasks.next();
				session.saveOrUpdate(weekTask);
				logger.debug("Saving WeekTask id=" + weekTask.getId());
			}
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
		
		return weekTasks;
	}
	
	public List<TodayTask> saveTodayTasks(List<TodayTask> todayTasks) {
		logger.trace("saveTodayTasks()");
		
		try {
			beginTranx();
			
			Iterator<TodayTask> itTodayTasks = todayTasks.iterator();
			while (itTodayTasks.hasNext()) {
				TodayTask todayTask = itTodayTasks.next();
				logger.debug("Saving TodayTask id=" + todayTask.getId());
				session.saveOrUpdate(todayTask);
			}
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
		
		return todayTasks;
	}
	
	public DateEvent saveDateEvent(DateEvent dateEvent) throws Exception {
		logger.trace("saveDateEvent()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(dateEvent);
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		
		return dateEvent;
	}
	
	public WeekFocus saveWeekFocus(WeekFocus weekFocus) throws Exception {
		logger.trace("saveWeekFocus()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(weekFocus);
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		
		return weekFocus;
	}
	
	public WeekTask saveWeekTask(WeekTask weekTask) throws Exception {
		logger.trace("saveWeekTask()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(weekTask);
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		
		return weekTask;
	}
	
	public TodayTask saveTodayTask(TodayTask todayTask) throws Exception {
		logger.trace("saveTodayTask()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(todayTask);
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		
		return todayTask;
	}
	
	public TextNote saveTextNote(TextNote textNote) throws Exception {
		logger.trace("saveTextNote()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(textNote.getNoteEntry());
			Iterator<NoteLink> itNoteLinks = textNote.getNoteEntry().getLinks().iterator();
			while (itNoteLinks.hasNext()) {
				NoteLink noteLink = itNoteLinks.next();
				noteLink.setNoteEntry(textNote.getNoteEntry());
				session.saveOrUpdate(noteLink);
			}
			session.saveOrUpdate(textNote);
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		
		return textNote;
	}
	
	public Job saveJob(Job job) throws Exception {
		logger.trace("saveJob()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(job);
			logger.debug("saveJob(): job id(" + job.getId() + ") saved.");
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		return job;
	}
	
	public JobStage saveJobStage(JobStage stage) throws Exception {
		logger.trace("saveJobStage()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(stage);
			logger.debug("saveJobStage(): stage id(" + stage.getId() + ") saved.");
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		return stage;
	}
	
	public JobTask saveJobTask(JobTask task) throws Exception {
		logger.trace("saveJobTask()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(task);
			logger.debug("saveJobTask(): task id(" + task.getId() + ") saved.");
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		return task;
	}
	
	public NoteLink saveJobTaskNoteEntry(NoteLink jobTaskNoteEntry) throws Exception {
		logger.trace("saveJobTaskNote()");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(jobTaskNoteEntry);
			logger.debug("saveJobTaskNote(): taskNote id(" + jobTaskNoteEntry.getId() + ") saved.");
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		return jobTaskNoteEntry;
	}
	
	public void poll() {
		logger.trace("poll()");
	}
	
	public JobmanPref getPref() {
		JobmanPref pref = new JobmanPref();
		
		return pref;
	}

	public Map<String, Object> load() {
		logger.trace("load()");
		Map<String, Object> data = new HashMap<String, Object>();
		
		try {
			beginTranx();
				
			/* Load Preferences */
			JobmanPref pref = getPref();
			data.put("pref", pref);

			/* Load Public Holidays */
			List<PublicHoliday> publicHolidays = session.createCriteria(PublicHoliday.class).list();
			data.put("publicHolidays", publicHolidays);

			/* Load Date Events */
			List<DateEvent> dateEvents = session.createCriteria(DateEvent.class).list();
			data.put("dateEvents", dateEvents);

			/* Load Job Files */
			List<JobFile> jobfiles = session.createCriteria(JobFile.class).list();
			Iterator<JobFile> itJobFiles = jobfiles.iterator();
			while (itJobFiles.hasNext()) {
				JobFile jobfile = itJobFiles.next();
				if (pref.getWorkingJobfile() == 0)
					pref.setWorkingJobfile(jobfile.getId());
				
				if (jobfile.getId() == pref.getWorkingJobfile()) {
					jobfile.getWeekFocuses().size();
					jobfile.getWeekTasks().size();
					jobfile.getTodayTasks().size();
					
					Iterator<NoteEntry> itNoteEntries = jobfile.getNoteEntries().iterator();
					while (itNoteEntries.hasNext()) {
						NoteEntry noteEntry = itNoteEntries.next();
						noteEntry.getLinks().size();
					}
					
					if (jobfile.getJobs().size() > 0) {
						Iterator<Job> itJobs = jobfile.getJobs().iterator();
						while (itJobs.hasNext()) {
							Job job = itJobs.next();
							job.getStages().size();
							if (job.getTasks().size() > 0) {
								Iterator<JobTask> itJobTasks = job.getTasks().iterator();
								while (itJobTasks.hasNext()) {
									JobTask task = itJobTasks.next();
									
									List<NoteLink> noteLinks = session.createCriteria(NoteLink.class)
										.add(Restrictions.eq("objectType", JobTask.OBJECT_TYPE))
										.add(Restrictions.eq("objectId", task.getId()))
										.list();
									
									task.setNoteLinks(noteLinks);
								}
							}
						}
					}
				}
			}
			logger.debug("No. of JobFiles: " + jobfiles.size());
			data.put("jobfiles", jobfiles);
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
		
		return data;
	}
	
	public List<PublicHoliday> loadPublicHolidays() {
		logger.trace("loadPublicHolidays()");
		List<PublicHoliday> publicHolidays = null;
		
		try {
			beginTranx();
			
			/* Load Public Holidays */
			publicHolidays = session.createCriteria(PublicHoliday.class).list();
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
		
		return publicHolidays;
	}
	
	public JobFile loadJobFileDetails(int id) throws Exception {
		JobFile jobfile = null;
		logger.trace("loadJobFileDetails()");
		
		try {
			beginTranx();
			
			jobfile = (JobFile) session.get(JobFile.class, id);
			if (jobfile != null) {
				jobfile.getWeekFocuses().size();
				jobfile.getWeekTasks().size();
				jobfile.getTodayTasks().size();
				
				Iterator<NoteEntry> itNoteEntries = jobfile.getNoteEntries().iterator();
				while (itNoteEntries.hasNext()) {
					NoteEntry noteEntry = itNoteEntries.next();
					noteEntry.getLinks().size();
				}
				
				if (jobfile.getJobs().size() > 0) {
					Iterator<Job> itJobs = jobfile.getJobs().iterator();
					while (itJobs.hasNext()) {
						Job job = itJobs.next();
						job.getStages().size();
						if (job.getTasks().size() > 0) {
							Iterator<JobTask> itJobTasks = job.getTasks().iterator();
							while (itJobTasks.hasNext()) {
								JobTask task = itJobTasks.next();
								
								List<NoteLink> noteLinks = session.createCriteria(NoteLink.class)
									.add(Restrictions.eq("objectType", JobTask.OBJECT_TYPE))
									.add(Restrictions.eq("objectId", task.getId()))
									.list();
								
								task.setNoteLinks(noteLinks);
							}
						}
					}
				}
			}
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		
		return jobfile;
	}

	public TextNote getTextNote(int noteId) throws Exception {
		TextNote textNote = null;
		
		try {
			beginTranx();
			
			textNote = (TextNote) session.createCriteria(TextNote.class)
				.add(Restrictions.eq("noteEntry.id", noteId))
				.uniqueResult();
//			textNote.getNoteEntry().getJobfile().getFilename();
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
			throw new Exception(e);
		}
		
		return textNote;
	}
}
