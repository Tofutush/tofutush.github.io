---
title: Thanos Snap
date: "2024-10-15"
---

*Or, Achilles chases the turtle but genocide instead.*

A friend of mine today said as an exasperated joke, "I am Thanos and I would snap two times and kill everyone!"

And I was like, "Well actually you can only kill 75%. Because after you snapped once, only half were left, and if you snap again you can only kill a fourth."[^1]

By that logic, Thanos can never kill everyone.

Except that he can, because you can't split one person into infinitely small pieces. When there's one last person left on Earth (besides Thanos himself as we're gonna assume he's immune[^1] so he won't die halfway through the snapping), he could just kill the guy with his bare hands.

Each time he snaps, the number of people in the world decreases by a half. The percentage of people left forms a series that stops until $2^n$ reaches the current world population, which we're gonna say is 7,951,000,000,000:

$$
\frac{1}{2}, \frac{1}{4}, \frac{1}{8}, \frac{1}{16}... \frac{1}{2^n}
$$

Replace all the 1's with 7,951,000,000's and we get the number of people left.

If it's infinite, like if we assume a person *can* be chopped into infinite bits, we can say that the number of people left alive approaches zero as the number of snaps approaches infinity.

$$
\lim_{n \to \infty} \frac{1}{2^n} = 0
$$

So how many snaps does it really take to kill everybody? $\frac{7,951,000,000}{2^{33}} \approx 0.9$. So, snapping 33 times, or maybe 34 ~ 35 for good measure, can make sure everybody is dead.

Wow did I seriously just spend half an hour wondering how to kill everyone on Earth? I think I need help.

[^1]: I've never watched any Marvel movies alright? I don't care if it's canonically accurate.
