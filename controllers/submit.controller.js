const SubmitService = require("../services/submit.service");
const CustomError = require("../middlewares/errorHandler");
const Joi = require("joi");

class SubmitController {
    submitService = new SubmitService();

    // 출장 신청
    scheduleSubmit = async (req, res, next) => {
        const {startDay, endDay, title, location, ref, content} = req.body
        const {userId, teamId} = res.locals.user

        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음, 다중이라면 file => files로 변경

        // 파일이 있을때와 없을때
        const file = req.file ? await req.file.location : null

        const schema = Joi.object({
            startDay: Joi.string().required().messages({
                "string.base": "startDay 필드는 날짜로 이루어져야 합니다.",
                "string.empty": "일정을 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            endDay: Joi.string().required().messages({
                "string.base": "endDay 필드는 날짜로 이루어져야 합니다.",
                "string.empty": "일정을 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            title: Joi.string().required().messages({
                "string.base": "title 필드는 문자열로 이루어져야 합니다.",
                "string.empty": "제목을 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            ref: Joi.array().required().messages({
                "string.base": "ref 필드는 문자열로 이루어져야 합니다.",
                "string.empty": "멘션을 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            location: Joi.string().required().messages({
                "string.base": "location 필드는 문자열로 이루어져야 합니다.",
                "string.empty": "장소를 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            content: Joi.string().required().messages({
                "string.base": "content 필드는 문자열로 이루어져야 합니다.",
            }),
        });

        const validate = schema.validate(
            {
                startDay: startDay,
                endDay: endDay,
                title: title,
                ref: ref,
                location: location,
                content: content,
            },
            // 한 번에 모든 에러를 확인하고 싶으면 validate 시점에 동작을 제어할 수 있는 validate()의 세 번째 파라미터로 {abortEarly: false}를 설정하면 된다.
            { abortEarly: false }
        );

        if (validate.error) {
            throw new CustomError(validate.error.message, 401);
        } else {
            console.log("Valid input!");
        }

        try {
            const ScheduleSubmit = await this.submitService.scheduleSubmit({
                userId,
                teamId: teamId,
                startDay,
                endDay,
                title,
                ref: ref,
                location,
                content,
                file
            });

            return res.status(200).send({ message : '출장 신청이 성공적으로 완료되었습니다.'})
        }catch(error) {
            next(error)
        }
    }

    // 일정 수정
    scheduleModify = async(req, res, next) => {
        const {startDay, endDay, title, location, ref, content} = req.body
        const {userId, teamId} = res.locals.user
        const {eventId} = req.params

        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음, 다중이라면 file => files로 변경

        // 파일이 있을때와 없을때
        const file = req.file ? await req.file.location : null

        const schema = Joi.object({
            startDay: Joi.string().required().messages({
                "string.base": "startDay 필드는 날짜로 이루어져야 합니다.",
                "string.empty": "일정을 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            endDay: Joi.string().required().messages({
                "string.base": "endDay 필드는 날짜로 이루어져야 합니다.",
                "string.empty": "일정을 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            title: Joi.string().required().messages({
                "string.base": "title 필드는 문자열로 이루어져야 합니다.",
                "string.empty": "제목을 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            ref: Joi.array().required().messages({
                "string.base": "ref 필드는 문자열로 이루어져야 합니다.",
                "string.empty": "멘션을 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            location: Joi.string().required().messages({
                "string.base": "location 필드는 문자열로 이루어져야 합니다.",
                "string.empty": "장소를 입력해 주세요.",
                "any.required": "이 필드는 필수입니다.",
            }),
            content: Joi.string().required().messages({
                "string.base": "content 필드는 문자열로 이루어져야 합니다.",
            }),
        });

        const validate = schema.validate(
            {
                startDay: startDay,
                endDay: endDay,
                title: title,
                ref: ref,
                location: location,
                content: content,
            },
            // 한 번에 모든 에러를 확인하고 싶으면 validate 시점에 동작을 제어할 수 있는 validate()의 세 번째 파라미터로 {abortEarly: false}를 설정하면 된다.
            { abortEarly: false }
        );

        if (validate.error) {
            throw new CustomError(validate.error.message, 401);
        } else {
            console.log("Valid input!");
        }

        try {
            const ScheduleSubmit = await this.submitService.scheduleModify({
                userId,
                eventId,
                teamId: teamId,
                startDay,
                endDay,
                title,
                ref: ref,
                location,
                content,
                file
            });

            return res.status(200).send({ message : '일정 수정이 성공적으로 완료되었습니다.'})
        }catch(error) {
            next(error)
        }
    }

    // 휴가 신청
    vacationSubmit = async(req, res, next) => {
        const {typeDetail, startDay, endDay} = req.body
        const {userId} = res.locals.user
        
        const schema = Joi.object({
            startDay: Joi.string().required().messages({
                'string.base' : 'startDay 필드는 날짜로 이루어져야 합니다.',
                'string.empty' : '일정을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            endDay: Joi.string().required().messages({
                'string.base' : 'endDay 필드는 날짜로 이루어져야 합니다.',
                'string.empty' : '일정을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            typeDetail: Joi.string().required().messages({
                'string.base' : 'typeDetail 필드는 날짜로 이루어져야 합니다.',
                'string.empty' : '휴가 종류를 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
        })

        const validate = schema.validate(
            {
                startDay : startDay,
                endDay : endDay,
                typeDetail : typeDetail
            },
            // 한 번에 모든 에러를 확인하고 싶으면 validate 시점에 동작을 제어할 수 있는 validate()의 세 번째 파라미터로 {abortEarly: false}를 설정하면 된다.
            { abortEarly: false }
        )

        if (validate.error) {
            throw new CustomError(validate.error.message, 401)
        }else {
            console.log('Valid input!')
        }

        try {
            const vacationSubmit = await this.submitService.vacationSubmit({
                userId,
                startDay,
                endDay,
                typeDetail,
            })

            return res.status(200).send({ message : '휴가 신청이 성공적으로 완료되었습니다.'})
        }catch(error) {
            next(error);
        }
    }

    // 기타 신청
    otherSubmit = async(req, res, next) => {
        const {startDay, endDay, title, content, ref} = req.body
        const {userId, teamId} = res.locals.user
        console.log('파일 객체',req.file)
        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음, 다중이라면 file => files로 변경

        // 파일이 있을때와 없을때
        const file = req.file ? await req.file.location : null

        const schema = Joi.object({
            startDay: Joi.string().required().messages({
                'string.base' : 'startDay 필드는 날짜로 이루어져야 합니다.',
                'string.empty' : '일정을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            endDay: Joi.string().required().messages({
                'string.base' : 'endDay 필드는 날짜로 이루어져야 합니다.',
                'string.empty' : '일정을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            title: Joi.string().required().messages({
                'string.base' : 'title 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '제목을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            ref: Joi.array().required().messages({
                'string.base' : 'ref 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '멘션을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            content: Joi.string().required().messages({
                'string.base' : 'content 필드는 문자열로 이루어져야 합니다.',
            }),
        })

        const validate = schema.validate(
            {
                startDay : startDay,
                endDay : endDay,
                title : title,
                ref : ref,
                content : content,
            },
            // 한 번에 모든 에러를 확인하고 싶으면 validate 시점에 동작을 제어할 수 있는 validate()의 세 번째 파라미터로 {abortEarly: false}를 설정하면 된다.
            { abortEarly: false }
        )

        if (validate.error) {
            throw new CustomError(validate.error.message, 401)
        }else {
            console.log('Valid input!')
        }

        try{
            const OtherSubmit = await this.submitService.otherSubmit({
                userId,
                teamId: teamId,
                startDay,
                endDay,
                title,
                ref: ref,
                content,
                file
            })

            return res.status(200).send({ message : '기타 신청이 성공적으로 완료되었습니다.'})
        }catch(err) {
            next(err);
        }
    }

    // 회의 신청
    meetingSubmit = async(req, res, next) => {
        const {startDay, startTime, title, location, ref, content} = req.body
        const {userId, teamId} = res.locals.user

        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음, 다중이라면 file => files로 변경

        // 파일이 있을때와 없을때
        const file = req.file ? await req.file.location : null

        const schema = Joi.object({
            startDay: Joi.string().required().messages({
                'string.base' : 'startDay 필드는 날짜로 이루어져야 합니다.',
                'string.empty' : '일정을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            startTime: Joi.string().required().messages({
                'string.base' : 'endDay 필드는 날짜로 이루어져야 합니다.',
                'string.empty' : '일정을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            title: Joi.string().required().messages({
                'string.base' : 'title 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '제목을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            ref: Joi.array().required().messages({
                'string.base' : 'ref 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '멘션을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            location: Joi.string().required().messages({
                'string.base' : 'location 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '장소를 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            content: Joi.string().required().messages({
                'string.base' : 'content 필드는 문자열로 이루어져야 합니다.',
            }),
        })

        const validate = schema.validate(
            {
                startDay : startDay,
                startTime : startTime,
                title : title,
                ref : ref,
                location : location,
                content : content,
            },
            // 한 번에 모든 에러를 확인하고 싶으면 validate 시점에 동작을 제어할 수 있는 validate()의 세 번째 파라미터로 {abortEarly: false}를 설정하면 된다.
            { abortEarly: false }
        )

        if (validate.error) {
            throw new CustomError(validate.error.message, 401)
        }else {
            console.log('Valid input!')
        }

        try{
            const MeetingSubmit = await this.submitService.meetingSubmit({
                userId,
                teamId: teamId,
                startDay,
                startTime,
                title,
                ref: ref,
                location,
                content,
                file
            })

            return res.status(200).send({ message : '회의 신청이 성공적으로 완료되었습니다.'})
        }catch(error) {
            next(error)
        }
    }

    // 보고서 등록
    reportSubmit = async(req, res, next) => {
        const {title, content, ref} = req.body
        const {userId, teamId} = res.locals.user

        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음, 다중이라면 file => files로 변경
        // 파일이 있을때와 없을때
        const file = req.file ? await req.file.location : null

        const schema = Joi.object({
            title: Joi.string().required().messages({
                'string.base' : 'title 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '제목을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            ref: Joi.array().required().messages({
                'string.base' : 'ref 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '멘션을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            content: Joi.string().required().messages({
                'string.base' : 'content 필드는 문자열로 이루어져야 합니다.',
            }),
        })

        const validate = schema.validate(
            {
                title : title,
                ref : ref,
                content : content,
            },
            // 한 번에 모든 에러를 확인하고 싶으면 validate 시점에 동작을 제어할 수 있는 validate()의 세 번째 파라미터로 {abortEarly: false}를 설정하면 된다.
            { abortEarly: false }
        )

        if (validate.error) {
            throw new CustomError(validate.error.message, 401)
        }else {
            console.log('Valid input!')
        }
        try{
            await this.submitService.reportSubmit({
                userId,
                teamId : teamId,
                title,
                ref : ref,
                content,
                file
            })

            return res.status(200).send({ message : '보고서 등록이 성공적으로 완료되었습니다.'})
        }catch(error) {
            next(error)
        }
    }

    // 보고서 수정
    reportModify = async(req ,res, next) => {
        const {title, content, ref} = req.body
        const {userId, teamId} = res.locals.user
        const {eventId} = req.params

        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음, 다중이라면 file => files로 변경
        // 파일이 있을때와 없을때
        const file = req.file ? await req.file.location : null

        const schema = Joi.object({
            title: Joi.string().required().messages({
                'string.base' : 'title 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '제목을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            ref: Joi.array().required().messages({
                'string.base' : 'ref 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '멘션을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            content: Joi.string().required().messages({
                'string.base' : 'content 필드는 문자열로 이루어져야 합니다.',
            }),
        })

        const validate = schema.validate(
            {
                title : title,
                ref : ref,
                content : content,
            },
            // 한 번에 모든 에러를 확인하고 싶으면 validate 시점에 동작을 제어할 수 있는 validate()의 세 번째 파라미터로 {abortEarly: false}를 설정하면 된다.
            { abortEarly: false }
        )

        if (validate.error) {
            throw new CustomError(validate.error.message, 401)
        }else {
            console.log('Valid input!')
        }
        try{
            await this.submitService.reportModify({
                userId,
                eventId,
                teamId : teamId,
                title,
                ref : ref,
                content,
                file
            })

            return res.status(200).send({ message : '보고서 수정이 성공적으로 완료되었습니다.'})
        }catch(error) {
            next(error)
        }
    }

    // 회의록 등록
    meetingReportSubmit = async(req, res, next) => {
        const {title, content, ref} = req.body
        const {userId, teamId} = res.locals.user
        const {eventId} = req.params

        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음, 다중이라면 file => files로 변경
        // 파일이 있을때와 없을때
        const file = req.file ? await req.file.location : null

        const schema = Joi.object({
            title: Joi.string().required().messages({
                'string.base' : 'title 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '제목을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            ref: Joi.array().required().messages({
                'string.base' : 'ref 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '멘션을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            content: Joi.string().required().messages({
                'string.base' : 'content 필드는 문자열로 이루어져야 합니다.',
            }),
        })

        const validate = schema.validate(
            {
                title : title,
                ref : ref,
                content : content,
            },
            // 한 번에 모든 에러를 확인하고 싶으면 validate 시점에 동작을 제어할 수 있는 validate()의 세 번째 파라미터로 {abortEarly: false}를 설정하면 된다.
            { abortEarly: false }
        )

        if (validate.error) {
            throw new CustomError(validate.error.message, 401)
        }else {
            console.log('Valid input!')
        }
        try{
            await this.submitService.meetingReportSubmit({
                userId,
                meetingId : eventId,
                teamId : teamId,
                title,
                ref : ref,
                content,
                file
            })

            return res.status(200).send({ message : '회의록 등록이 성공적으로 완료되었습니다.'})
        }catch(error) {
            next(error)
        }
    }

    // 회의록 수정
    meetingReportModify = async(req, res, next) => {
        const {title, content, ref} = req.body
        const {userId, teamId} = res.locals.user
        const {meetingId} = req.params

        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음, 다중이라면 file => files로 변경
        // 파일이 있을때와 없을때
        const file = req.file ? await req.file.location : null

        const schema = Joi.object({
            title: Joi.string().required().messages({
                'string.base' : 'title 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '제목을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            ref: Joi.array().required().messages({
                'string.base' : 'ref 필드는 문자열로 이루어져야 합니다.',
                'string.empty' : '멘션을 입력해 주세요.',
                'any.required' : '이 필드는 필수입니다.'
            }),
            content: Joi.string().required().messages({
                'string.base' : 'content 필드는 문자열로 이루어져야 합니다.',
            }),
        })

        const validate = schema.validate(
            {
                title : title,
                ref : ref,
                content : content,
            },
            // 한 번에 모든 에러를 확인하고 싶으면 validate 시점에 동작을 제어할 수 있는 validate()의 세 번째 파라미터로 {abortEarly: false}를 설정하면 된다.
            { abortEarly: false }
        )

        if (validate.error) {
            throw new CustomError(validate.error.message, 401)
        }else {
            console.log('Valid input!')
        }
        try{
            await this.submitService.meetingReportModify({
                userId,
                meetingId,
                teamId : teamId,
                title,
                ref : ref,
                content,
                file
            })

            return res.status(200).send({ message : '회의록 수정이 성공적으로 완료되었습니다.'})
        }catch(error) {
            next(error)
        }
    }

    // 팀원 목록 조회
    teamUsersList = async(req, res, next) => {
        try {
            const {teamId} = res.locals.user

            const findTeamUsers = await this.submitService.teamUsersList(teamId)

            return res.status(200).json(findTeamUsers)
        } catch (error) {
            next(error)
        }
        
    }
}

module.exports = SubmitController;
