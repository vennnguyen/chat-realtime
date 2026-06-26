import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friends.js";
import User from "../models/User.js";

export const sendFriendRequest = async (req, res) => {
    try {
        const { to, message} = req.body; // người nhận lời mời kết bạn

        const from = req.user._id; // người đang đăng nhập
        if(from === to) {
            return res
            .status(400)
            .json({ message: "Bạn không thể gửi yêu cầu kết bạn cho chính mình" });
        }

        const userExists = await User.exists({ _id: to });
        if (!userExists) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        let userA = from.toString();
        let userB = to.toString();
        if(userA > userB) {
            [userA, userB] = [userB, userA];
        }
        const [alreadyFriends, requestExists] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from },
                ]
            }),
        ]);

        if (alreadyFriends) {
            return res.status(400).json({ message: "Bạn đã là bạn bè của người này" });
        }
        if (requestExists) {
            return res.status(400).json({ message: "Đã tồn tại yêu cầu kết bạn giữa hai người" });
        }

        const friendRequest = await FriendRequest.create({ from, to, message });
        res.status(201).json({ message: "Gửi lời mời kết bạn thành công", friendRequest });
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu kết bạn", error);
        res.status(500).json({ message: error.message });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(id);
        if (!request) {
            return res.status(404).json({ message: "Yêu cầu kết bạn không tồn tại" });
        }
        //chỉ có bạn mới được chấp nhận lời mời
        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền chấp nhận yêu cầu kết bạn này" });
        }

        const friend = await Friend.create({ userA: request.from, userB: request.to });
        await FriendRequest.findByIdAndDelete(id);

        const from = await User.findById(request.from).select("_id displayName avatarUrl").lean();
        res.status(200).json({ message: "Chấp nhận yêu cầu kết bạn thành công", newFriend: {
                _id: from._id,
                displayName: from.displayName,
                avatarUrl: from.avatarUrl
            }});
    } catch (error) {
        console.error("Lỗi khi chấp nhận yêu cầu kết bạn", error);
        res.status(500).json({ message: error.message });
    }
}

export const declineFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(id);
        if (!request) {
            return res.status(404).json({ message: "Yêu cầu kết bạn không tồn tại" });
        }
        //chỉ có bạn mới được từ chối lời mời
        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền từ chối yêu cầu kết bạn này" });
        }

        await request.findByIdAndDelete(id);
        res.status(200).json({ message: "Từ chối yêu cầu kết bạn thành công" });
    } catch (error) {
        console.error("Lỗi khi từ chối yêu cầu kết bạn", error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friend.find({
      $or: [
        {
          userA: userId,
        },
        {
          userB: userId,
        },
      ],
    })
      .populate("userA", "_id displayName avatarUrl username")
      .populate("userB", "_id displayName avatarUrl username")
      .lean();

    if (!friendships.length) {
      return res.status(200).json({ friends: [] });
    }

    const friends = friendships.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA
    );

    return res.status(200).json({ friends });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const populateFields = "_id username displayName avatarUrl";

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields),
    ]);

    res.status(200).json({ sent, received });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu cầu kết bạn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};