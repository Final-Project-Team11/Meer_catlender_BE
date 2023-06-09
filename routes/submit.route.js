const express = require("express");
const router = express.Router();
const { upload } = require('../middlewares/fileUpload');
const authMiddleware = require('../middlewares/auth-middleware')

const SubmitController = require("../controllers/submit.controller");
const submitController = new SubmitController();

// 출장 신청
router.post("/schedule", authMiddleware, upload.array('file'), submitController.scheduleSubmit); // 단일파일이라면 single => 다중파일이라면 array 프론트에서는 multiple

// 일정 수정
router.patch('/schedule/:Id', authMiddleware, upload.array('file'), submitController.scheduleModify)

// 휴가 신청
router.post('/vacation', authMiddleware, submitController.vacationSubmit )

// 기타 신청
router.post('/other', authMiddleware, upload.array('file'), submitController.otherSubmit)

// 회의 신청
router.post('/meeting', authMiddleware, upload.array('file'), submitController.meetingSubmit)

// 보고서 등록
router.post('/report', authMiddleware, upload.array('file'), submitController.reportSubmit)

// 보고서 수정
router.patch('/report/:Id', authMiddleware, upload.array('file'), submitController.reportModify)

// 회의록 등록
router.post('/meeting/:Id', authMiddleware, upload.array('file'), submitController.meetingReportSubmit)

// 회의록 수정
router.patch('/meeting/:meetingId/:Id', authMiddleware, upload.array('file'), submitController.meetingReportModify)

// 팀원 목록 조회
router.get('/teamUsers', authMiddleware, submitController.teamUsersList)

module.exports = router;
