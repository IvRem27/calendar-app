import './MonthPicker.css'
import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import CalendarGrid from './CalendarGrid'
import axios from 'axios'

class MonthPicker extends React.Component {

    constructor(props) {
        super(props)
        this.handleLeftArrowClick = this.handleLeftArrowClick.bind(this)
        this.handleRightArrowClick = this.handleRightArrowClick.bind(this)
        this.state = {
            currentMonth: moment().startOf('month'),
            data: {}
        }
    }

    componentDidMount() {
       
        this.getGithubCommits(this.state.currentMonth)
    }

    async getGithubCommits(startDate) {
        const lastDateOfMonth = startDate.clone().endOf('M')
        try {
            const response = await axios.get(`https://api.github.com/repos/sequelize/sequelize/commits?since=${startDate.format("YYYY-MM-DD")}&until=${lastDateOfMonth.format("YYYY-MM-DD")}`)
            const map = {}
            response.data.forEach((entry) => {
                const date = moment(entry.commit.committer.date).format("YYYY-MM-DD")
                if (map[date] === undefined) {
                    map[date] = {
                        commitMessage: entry.commit.message,
                        commitUrl: entry.url,
                        commitAuthor: entry.author.login
                    }
                }
            })
            this.setState({
                data: map
            })
        } catch (error) {
            console.error("error", error)
        }
    }

    async handleLeftArrowClick(e) {
        e.preventDefault()
        const startDate = this.state.currentMonth.subtract(1, 'M')
        this.setState({
            currentMonth: startDate
        })
        await this.getGithubCommits(startDate)
    }

    async handleRightArrowClick(e) {
        e.preventDefault()
        const startDate = this.state.currentMonth.add(1, 'M')
        this.setState({
            currentMonth: startDate
        })
        await this.getGithubCommits(startDate)
    }

    render() {
        return (
            <div>
                <nav id="monthPicker">
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" onClick={this.handleLeftArrowClick} />
                    <div>{this.state.currentMonth.format('MMMM YYYY')}</div>
                    <FontAwesomeIcon icon={faArrowRight} size="lg" onClick={this.handleRightArrowClick} />
                </nav>
                <CalendarGrid firstDateOfMonth={this.state.currentMonth.unix()} data={this.state.data} />
            </div>
        )
    }
}

export default MonthPicker
