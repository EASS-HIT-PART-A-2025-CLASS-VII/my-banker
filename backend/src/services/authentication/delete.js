const deleteUser = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json(badRequestJsonResponse('User not found'));

    return res.status(200).json(successJsonResponse('User deleted successfully'));
  } catch (error) {
    return res.status(500).json(internalErrorJsonResponse('Server error'));
  }
};

module.exports = deleteUser;
