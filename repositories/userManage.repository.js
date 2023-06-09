const { Users, Companys, Teams, Sequelize, sequelize } = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../middlewares/errorHandler");

class UserManageRepository {
    //유저 수정
    updateUser = async ({ userId, teamId, job, authLevel, rank }) => {
        await Users.update(
            {
                teamId,
                authLevel,
                rank,
                job
            },
            {
                where: { userId },
            }
        );
    };
    // 유저 삭제
    deleteUser = async (existUser) => {
        console.log(existUser);
        await existUser.destroy();
    };
    
    // 유저 검색
    findUserByName = async ({ userName, companyId }) => {
        const users = await Users.findAll({
            attributes: [
                "userId",
                "userName",
                "rank",
                [Sequelize.fn("date_format",Sequelize.col("joinDay"),"%Y/%m/%d"),"joinDay"],
                "job",
                "authLevel",
                [Sequelize.col("Team.teamName"), "team"],
                "salaryDay"
            ],
            where: {
                companyId,
                userName: {
                    [Op.like]: `%${userName}%`,
                },
            },
            include: [
                {
                    model: Teams,
                    attributes: [],
                },
            ],
        });
        return users;
    };
    // 회사 팀 리스트
    // 들어오는 인자에 따라 다른값 리턴
    findTeamsByCompanyId = async ({ companyId, team }) => {
        const where = { companyId };
        if (team) {
            where.teamName = team;
        }
        const teams = await Teams.findAll({
            raw:true,
            where: where,
            attributes: ["teamId", ["teamName", "team"]],
        });
        return teams;
    };
    // 회사 전체 유저 리스트, 부서별 유저 조회
    findAllCompanyUser = async ({ companyId, teamId }) => {
        const where = { companyId };
        
        // teamId 가 있을 경우에만 where 객체에 teamId 속성 추가
        if (teamId) {
            where.teamId = teamId;
        }
        const companyUserList = await Users.findAll({
            raw: true,
            attributes: [
                "userId",
                "userName",
                "rank",
                [Sequelize.fn("date_format",Sequelize.col("joinDay"),"%Y/%m/%d"),"joinDay"],
                "job",
                [Sequelize.col("Team.teamName"), "team"],
                "authLevel",
                'salaryDay'

            ],
            where: where,
            include: [
                {
                    model: Teams,
                    attributes: [],
                },
            ],
        });
        return companyUserList;
    };

    // 아이디 중복 체크
    findUserById = async (userId) => {
        const existUser = await Users.findOne({
            where: { userId },
        });
        return existUser;
    };
    // 팀 생성
    createTeam = async ({ team, companyId, transaction },) => {
        const newTeam = await Teams.create({
            teamName: team,
            companyId,
        },
        {
            transaction
        });
        return newTeam;
    };
    // 팀 아이디 찾기
    findTeamId = async ({ team, companyId }) => {
        const existTeam = await Teams.findOne({
            where: {
                teamName: team,
                companyId,
            },
        });
        return existTeam;
    };
    // 유저 생성
    createUser = async ({
        teamId,
        authLevel,
        rank,
        userName,
        joinDay,
        userId,
        job,
        companyId,
        salaryDay,
        encryptPwd,
        transaction
    }) => {
        await Users.create({
            teamId,
            authLevel,
            rank,
            userName,
            password: encryptPwd,
            joinDay,
            userId,
            userId,
            job,
            companyId,
            salaryDay,
        },
        {
            transaction
        },
        {
            transaction
        });
    };
    createTeamAndUser = async ({
        team,
        companyId,
        authLevel,
        rank,
        userName,
        joinDay,
        userId,
        job,
        salaryDay,
        encryptPwd,
    }) => {
        const t = await sequelize.transaction();
        try {
            const teamInfo = await this.createTeam({ team, companyId, transaction: t, })
            const teamId = teamInfo.teamId
            await this.createUser({
                teamId,
                authLevel,
                rank,
                userName,
                joinDay,
                userId,
                job,
                companyId,
                salaryDay,
                encryptPwd,
                transaction: t,
            });
            await t.commit();
        } catch (transactionError) {
            await t.rollback()
            throw new CustomError(transactionError.message)
        }
    }
}

module.exports = UserManageRepository;
