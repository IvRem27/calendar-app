import './CalendarGrid.css'
import React from 'react'
import moment from 'moment'
import 'moment/locale/hr'
import ReactModal from 'react-modal';
moment.locale('hr')

class CalendarGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            selectedDate: null
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }


    handleOpenModal(date) {
        if (this.props.data[date]) {
            this.setState({
                showModal: true,
                selectedDate: date
            })
        }
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    getDatesBetweenDates(startDate, endDate) {
        const now = startDate.clone()
        const dates = []

        while (now.isSameOrBefore(endDate)) {
            dates.push(now.clone())
            now.add(1, 'days')
        }
        return dates
    }

    render() {
        const data = this.props.data

        const firstDateOfMonth = moment.unix(this.props.firstDateOfMonth)
        const lastDateOfMonth = firstDateOfMonth.clone().endOf('M')

        const renderWeeks = []

        const nextFirstDayOfWeek = firstDateOfMonth.clone().startOf("week")
        while (nextFirstDayOfWeek < lastDateOfMonth) { // for each week

            const lastDayOfWeek = nextFirstDayOfWeek.clone().endOf("week")

            const datesInWeek = this.getDatesBetweenDates(nextFirstDayOfWeek, lastDayOfWeek).map((date, index) => {
                const classes = `day${date.isBefore(firstDateOfMonth) || date.isAfter(lastDateOfMonth) ? " shadowed" : ""}`
                const mapKey = date.format("YYYY-MM-DD")
                let commitAuthor = ""

                if (data[mapKey] !== undefined) {
                    commitAuthor = data[mapKey].commitAuthor
                }

                return <div key={index} className={classes} onClick={() => this.handleOpenModal(mapKey)}>
                    <div>{date.format('DD')}</div>
                    <div>{commitAuthor}
                    </div>
                </div>
            })
            renderWeeks.push(<div key={nextFirstDayOfWeek.format('MM/DD/YYYY')} className="week">{datesInWeek}</div>)

            nextFirstDayOfWeek.add(1, "week")
        }

        const customStyles = {
            overlay: {

                backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: "#349beb",
                color: "white",
                width: "50%"
            },
        };


        let commitAuthor = ""
        let commitMessage = ""
        let commitUrl = ""

        const selectedDateData = data[this.state.selectedDate]
        if (selectedDateData !== undefined) {
            commitAuthor = selectedDateData.commitAuthor
            commitMessage = selectedDateData.commitMessage
            commitUrl = selectedDateData.commitUrl
        }

        return (
            <div>
                <div id="month">
                    <div id="weekDayNames" className="week">
                        <div className="day dayName">PON</div>
                        <div className="day dayName">UTO</div>
                        <div className="day dayName">SRI</div>
                        <div className="day dayName">CET</div>
                        <div className="day dayName">PET</div>
                        <div className="day dayName">SUB</div>
                        <div className="day dayName">NED</div>
                    </div>
                    {renderWeeks}
                </div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                    style={customStyles}
                    onRequestClose={this.handleCloseModal}
                >

                    <div>Author: <br></br>{commitAuthor}</div><br></br>
                    <div>Date: <br></br>{this.state.selectedDate}</div><br></br>
                    <div>Commit message: <br></br>{commitMessage}</div><br></br>
                    <div><a href={commitUrl}>Commit URL</a></div>
                </ReactModal>
            </div>


        )
    }
}

export default CalendarGrid
