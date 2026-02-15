const asyncHandler = require('../utils/asyncHandler');
const tripRepository = require('../repositories/trip.repository');
const AppError = require('../utils/AppError');

const requireTripMember = asyncHandler(async (req, res, next) => {
  const trip = await tripRepository.findById(req.params.id);
  if (!trip) throw new AppError('Trip not found', 404);

  const isMember = trip.members.some(m => m.userId === req.user.id);
  if (!isMember) throw new AppError('Access denied', 403);

  req.trip = trip;
  next();
});

const requireTripAdmin = asyncHandler(async (req, res, next) => {
  const trip = await tripRepository.findById(req.params.id);
  if (!trip) throw new AppError('Trip not found', 404);

  const isAdmin = trip.members.some(m => m.userId === req.user.id && m.role === 'admin');
  if (!isAdmin) throw new AppError('Only team leads can perform this action', 403);

  req.trip = trip;
  next();
});

module.exports = { requireTripMember, requireTripAdmin };