const ScheduleManageRepository = require("../repositories/scheduleManage.repository");
const CustomError = require("../middlewares/errorHandler");

class ScheduleManageService {
    constructor() {
        this.scheduleManageRepository = new ScheduleManageRepository();
    }
     // 출장 반려
    scheduleDeny = async ({ Id, userInfo }) => {
        const schedule = await this.scheduleManageRepository.findScheduleById({
            Id,
        });
        if (!schedule) {
            throw new CustomError("신청서가 존재하지 않습니다.",401)
        }
        const scheduleStatus = schedule.dataValues.status
        if (scheduleStatus === 'deny') {
            throw new CustomError("이미 결제가 완료되었습니다.",400)
        }
        const status = 'deny'
        await this.scheduleManageRepository.updateScheduleStaus({ Id, status })
    }
    // 출장 수락
    scheduleAccept = async ({ Id, userInfo }) => {
        const schedule = await this.scheduleManageRepository.findScheduleById({
            Id,
        });
        if (!schedule) {
            throw new CustomError("신청서가 존재하지 않습니다.",401)
        }
        const scheduleStatus = schedule.dataValues.status
        if (scheduleStatus === 'accept') {
            throw new CustomError("이미 결제가 완료되었습니다.",400)
        }
        const status = 'accept'
        await this.scheduleManageRepository.updateScheduleStaus({ Id, status })
    }
    // 출장 상세 조회
    scheduleDetail = async ({ Id }) => {
        let scheduleDetail =
            await this.scheduleManageRepository.findScheduleById({
                Id,
            })
        console.log((JSON.stringify(scheduleDetail, null, 4)))
        if (!scheduleDetail) {
            throw new CustomError("신청서가 존재하지 않습니다.",401)
        }
        scheduleDetail = scheduleDetail.dataValues
        const attendees = scheduleDetail.Mentions.map(
            (mention) => mention.User.userName
        );
        
        scheduleDetail.files = scheduleDetail.Files;
        delete scheduleDetail.Files;
        
        // scheduleDetail객체 Mentions속성 삭제
        scheduleDetail.attendees = attendees;
        delete scheduleDetail.Mentions;
        return scheduleDetail;
    };
    // 팀 출장 요청 전체 조회
    scheduleList = async ({ size, page, teamId }) => {
        let scheduleList =
            await this.scheduleManageRepository.findTeamSchedule({
                size,
                page,
                teamId,
            });
        const newscheduleList = scheduleList.map(
            (item) => {
                const newItem =item.toJSON()
                newItem.files = item.Event.Files
                delete newItem.Event;
                return newItem
            }
        )
        return newscheduleList;
    };
}
module.exports = ScheduleManageService;
