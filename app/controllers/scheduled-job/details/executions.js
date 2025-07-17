import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { later, cancel } from '@ember/runloop';
import { registerDestructor } from '@ember/destroyable';

export default class ScheduledJobDetailsExecutionsController extends Controller {
  @tracked execPage = 0;
  @tracked execSort = '-created';
  @tracked execStatus;

  @service router;

  execSize = 15;
  refreshInterval = null;
  isWindowActive = true;
  lastRefreshTime = null;
  refreshIntervalDuration = 120000; // 2 minutes

  queryParams = [
    { execPage: 'exec-page' },
    { execSize: 'exec-size' },
    { execStatus: 'exec-status' },
    { execSort: 'exec-sort' },
  ];

  constructor() {
    super(...arguments);

    // Initialize last refresh time
    this.lastRefreshTime = Date.now();

    // Setup auto-refresh and window focus handlers
    this.setupAutoRefresh();
    this.setupWindowFocusHandlers();

    // Register destructor for cleanup
    registerDestructor(this, () => {
      this.clearAutoRefresh();
      this.removeWindowFocusHandlers();
    });
  }

  setupAutoRefresh() {
    this.scheduleRefresh();
  }

  scheduleRefresh() {
    this.clearAutoRefresh();

    if (this.isWindowActive) {
      this.refreshInterval = later(
        this,
        () => {
          this.reload();
          this.scheduleRefresh();
        },
        this.refreshIntervalDuration
      );
    }
  }

  isDataStale() {
    const now = Date.now();
    const timeSinceLastRefresh = now - this.lastRefreshTime;
    return timeSinceLastRefresh >= this.refreshIntervalDuration;
  }

  clearAutoRefresh() {
    if (this.refreshInterval) {
      cancel(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  setupWindowFocusHandlers() {
    this.windowFocusHandler = () => {
      this.isWindowActive = true;
      if (this.isDataStale()) {
        this.reload();
      } else {
        this.scheduleRefresh();
      }
    };

    this.windowBlurHandler = () => {
      this.isWindowActive = false;
      this.clearAutoRefresh();
    };

    this.visibilityChangeHandler = () => {
      this.isWindowActive = !document.hidden;
      if (this.isWindowActive) {
        if (this.isDataStale()) {
          this.reload();
        } else {
          this.scheduleRefresh();
        }
      } else {
        this.clearAutoRefresh();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.windowFocusHandler);
      window.addEventListener('blur', this.windowBlurHandler);
      document.addEventListener(
        'visibilitychange',
        this.visibilityChangeHandler
      );

      // Set initial state based on document visibility
      this.isWindowActive = !document.hidden;
    }
  }

  removeWindowFocusHandlers() {
    if (typeof window !== 'undefined') {
      if (this.windowFocusHandler) {
        window.removeEventListener('focus', this.windowFocusHandler);
      }
      if (this.windowBlurHandler) {
        window.removeEventListener('blur', this.windowBlurHandler);
      }
      if (this.visibilityChangeHandler) {
        document.removeEventListener(
          'visibilitychange',
          this.visibilityChangeHandler
        );
      }
    }
  }

  @action
  reload() {
    this.lastRefreshTime = Date.now();
    this.router.refresh('scheduled-job.details.executions');
    // After refresh, schedule the next refresh
    this.scheduleRefresh();
  }
}
