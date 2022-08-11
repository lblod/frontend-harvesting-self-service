import Component from '@glimmer/component';

export default class StatusFilterComponent extends Component {
    statusRoutes = [
        {
            label: "Successful Jobs",
            route: "jobs.status.success"
        },
        {
            label: "Busy Jobs",
            route: "jobs.status.busy"
        },
        {
            label: "Scheduled Jobs",
            route: "jobs.status.scheduled"
        },
        {
            label: "Failed Jobs",
            route: "jobs.status.failed"
        },
        {
            label: "Canceled Jobs",
            route: "jobs.status.canceled"
        }          
    ]
}