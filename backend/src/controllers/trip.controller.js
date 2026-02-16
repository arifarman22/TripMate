const asyncHandler = require('../utils/asyncHandler');
const tripService = require('../services/trip.service');

const createTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.createTrip(req.user.id, req.body);
  res.status(201).json({ success: true, data: trip });
});

const getTrips = asyncHandler(async (req, res) => {
  const trips = await tripService.getUserTrips(req.user.id);
  res.json({ success: true, data: trips });
});

const getTripById = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(req.params.id, req.user.id);
  res.json({ success: true, data: trip });
});

const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(req.params.id, req.user.id, req.body);
  res.json({ success: true, data: trip });
});

const deleteTrip = asyncHandler(async (req, res) => {
  await tripService.deleteTrip(req.params.id, req.user.id);
  res.json({ success: true, message: 'Trip deleted successfully' });
});

const addMember = asyncHandler(async (req, res) => {
  const member = await tripService.addMember(req.params.id, req.body.email, req.user.id);
  res.status(201).json({ success: true, data: member });
});

const removeMember = asyncHandler(async (req, res) => {
  await tripService.removeMember(req.params.id, req.body.userId, req.user.id);
  res.json({ success: true, message: 'Member removed successfully' });
});

const getBalances = asyncHandler(async (req, res) => {
  const balances = await tripService.calculateBalances(req.params.id, req.user.id);
  res.json({ success: true, data: balances });
});

const getSuggestedPayments = asyncHandler(async (req, res) => {
  const payments = await tripService.calculateSuggestedPayments(req.params.id, req.user.id);
  res.json({ success: true, data: payments });
});

const getUserBalance = asyncHandler(async (req, res) => {
  const balance = await tripService.getUserBalance(req.params.id, req.user.id);
  res.json({ success: true, data: balance });
});

const updateMemberDeposit = asyncHandler(async (req, res) => {
  const result = await tripService.updateMemberDeposit(req.params.id, req.body.userId, req.body.amount, req.user.id);
  res.json({ success: true, data: result });
});

module.exports = { 
  createTrip, 
  getTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip, 
  addMember, 
  removeMember, 
  getBalances,
  getSuggestedPayments,
  getUserBalance,
  updateMemberDeposit
};
