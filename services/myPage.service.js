const MypageRepository = require("../repositories/myPage.repository.js");
const CustomError = require("../middlewares/errorHandler");
const moment = require("moment");
class MypageService {
    constructor() {
        this.MypageRepository = new MypageRepository();
    }

    checkUserById = async ({ userId }) => {
        const user = await this.MypageRepository.findUserById({ userId });
        if (!user) {
            throw new CustomError("해당 유저가 존재하지 않습니다.", 401);
        } else if (user.userId !== userId) {
            throw new CustomError(
                "유저 정보에 대한 권한이 존재하지 않습니다.",
                401
            );
        }
        return user;
    };
    getUserInfo = async ({ user }) => {
        const userSalaryDay = user.salaryDay;
        const date = moment();
        let month, year;
        month = moment().format("MM");
        year = moment().format("YYYY");

        if (Number(date.format("MM")) === 12) {
            year = moment().add(1, "year").format("YYYY");
        }
        if (Number(date.format("DD")) > userSalaryDay) {
            month = moment().add(1, "month").format("MM");
        }

        const Dday = `${year}-${month}-${userSalaryDay}`;
        const Ddate = moment(Dday);

        const payDay = Ddate.diff(date, "days");

        const userInfo = {
            userName: user.userName,
            remainDay: user.remainDay,
            salaryDay: payDay,
        };
        return userInfo;
    };

    getUserSchedule = async ({ userId }) => {
        return await this.MypageRepository.getUserSchedule({ userId });
    };

    getMentionedSchedules = async ({ userId }) => {
        //멘션테이블에서 내 아이디가 들어있는 값 가져오기
        const schedule = await this.MypageRepository.getMention({
            userId,
            type: "schedule",
        });
        //내가 언급된 스케줄 가져오기
        return await Promise.all(
            schedule.map(async (event) => {
                return await this.MypageRepository.getScheduleById({
                    eventId: event,
                    userId,
                });
            })
        );
    };

    getMentionedMeeting = async ({ userId }) => {
        //멘션테이블에서 내 아이디가 들어있는 값 가져오기
        const meeting = await this.MypageRepository.getMention({
            userId,
            type: "meeting",
        });
        //내가 언급된 미팅 가져오기
        return await Promise.all(
            meeting.map(async (event) => {
                return await this.MypageRepository.getMeetingById({
                    eventId: event,
                    userId,
                });
            })
        );
    };

    getMentionedReport = async ({userId}) => {
        //멘션테이블에서 내 아이디가 들어있는 값 가져오기
        const meeting = await this.MypageRepository.getMention({
            userId,
            type: "report",
        });
        //내가 언급된 미팅 가져오기
        return await Promise.all(
            meeting.map(async (event) => {
                return await this.MypageRepository.getReportById({
                    eventId: event,
                    userId,
                });
            })
        );
    };
    getMentionedOther = async ({userId}) => {
        //멘션테이블에서 내 아이디가 들어있는 값 가져오기
        const meeting = await this.MypageRepository.getMention({
            userId,
            type: "other",
        });
        //내가 언급된 미팅 가져오기
        return await Promise.all(
            meeting.map(async (event) => {
                return await this.MypageRepository.getOtherById({
                    eventId: event,
                    userId,
                });
            })
        );
    };

    filterIssue = async ({
        schedule,
        meeting,
        report,
        other,
    }) => {
        const issue = schedule.concat(meeting, report, other);
        const check = issue.filter(issue => issue.isChecked == true);
        const noncheck = issue.filter(issue => issue.isChecked == false);
        //최신순 정렬
        return {check,noncheck}
    }

    checkMention = async ({mentionId,userId}) => {
        const existMention = await this.MypageRepository.findMention({mentionId})
        if (!existMention){
            throw new CustomError("존재하지 않는 일정입니다.",401)
        }else if (existMention.userId !== userId){
            throw new CustomError("해당 일정에 권한이 존재하지 않습니다.",401)
        }
        return existMention;
    }
    completeMentioned = async({existMention,mentionId}) => {
        if (existMention.isChecked === false) {
            const check = true;
            await this.MypageRepository.updateMention({mentionId,check})
        } 
    }


}

module.exports = MypageService;
