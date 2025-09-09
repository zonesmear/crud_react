export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check DB for user
    const user = await clientService.findByEmail(email);

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // check password (use bcrypt if hashed)
    if (user.password !== password) {
      return res.status(401).json({ status: "error", message: "Invalid password" });
    }

    res.json({
      status: "success",
      user: { id: user.id, name: user.name, email: user.email }, // send minimal user info
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Login failed" });
  }
};