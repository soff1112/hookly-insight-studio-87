import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface StrategyMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  metadata?: {
    usedMetrics?: string[];
    actionType?: string;
    versionNumber?: number;
  };
}

export interface StrategySession {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  primaryAccountId?: string;
  competitorIds: string[];
  platformScope: string[];
  dateRange: string;
  messages: StrategyMessage[];
  currentVersion: number;
}

interface StrategyContextType {
  sessions: StrategySession[];
  activeSessionId: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  createSession: () => StrategySession;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => void;
  setActiveSession: (sessionId: string | null) => void;
  getActiveSession: () => StrategySession | null;
  addMessage: (sessionId: string, message: Omit<StrategyMessage, "id" | "sessionId" | "createdAt">) => StrategyMessage;
  regenerateStrategy: (sessionId: string) => void;
  sendUserMessage: (sessionId: string, content: string) => void;
}

const StrategyContext = createContext<StrategyContextType | undefined>(undefined);

// Mock analytics data that would come from the actual analytics service
const mockAnalyticsData = {
  userAccount: {
    handle: "@yourbrand",
    followers: 45200,
    avgER: 4.2,
    avgViews: 350000,
    postsPerDay: 2.3,
    avgDuration: 28,
    topHookType: "Emotional Story",
    avgComments: 122,
    avgReposts: 99,
  },
  competitors: [
    { handle: "@topcompetitor", followers: 2100000, avgER: 8.5, avgViews: 12500000, postsPerDay: 10 },
    { handle: "@mrbeast", followers: 180000000, avgER: 12.1, avgViews: 12500000, postsPerDay: 8 },
    { handle: "@khaby.lame", followers: 162000000, avgER: 9.8, avgViews: 9800000, postsPerDay: 5 },
    { handle: "@charli", followers: 155000000, avgER: 7.2, avgViews: 2100000, postsPerDay: 6 },
    { handle: "@addison", followers: 88000000, avgER: 6.5, avgViews: 1800000, postsPerDay: 4 },
  ],
  platforms: ["Instagram", "TikTok", "YouTube"],
  dateRange: "Last 7 days",
};

const generateInitialStrategy = (versionNumber: number = 1): string => {
  const { userAccount, competitors, platforms, dateRange } = mockAnalyticsData;
  const competitorAvgER = competitors.reduce((sum, c) => sum + c.avgER, 0) / competitors.length;
  
  return `## 📊 Strategy Report ${versionNumber > 1 ? `(Version ${versionNumber})` : ''}

> **Context:** Based on analysis of **your account (${userAccount.handle})** + **${competitors.length} tracked competitors** across ${platforms.join(", ")}. Data from: ${dateRange}.
> 
> **Personalized to your style:** Energetic & Educational

---

## 💪 Strengths

✅ **High Comment Engagement:** Your videos average ${userAccount.avgComments} comments per post—18% above competitor median. This indicates strong community connection. Leverage this for collaboration opportunities and user-generated content campaigns.

✅ **Emotional Hooks:** Your "${userAccount.topHookType}" hook type resonates well, achieving 87% virality. This is your signature strength.

---

## ⚠️ Weaknesses

⚠️ **Low Repost Rate:** Your reposts average ${userAccount.avgReposts} per video—35% below top competitors. Add clear CTAs ("Share this with someone who needs to hear it") to boost viral spread.

⚠️ **Posting Frequency Gap:** You post ${userAccount.postsPerDay} videos/day vs. top competitors' 8-10/day. This limits your reach potential by 77%.

---

## 🎯 Opportunities

🚀 **Trending: 15-Second Short-Form Videos** — Competitor @topcompetitor gained 5.2% followers using sub-15s hooks. Your avg duration is ${userAccount.avgDuration}s.

📱 **TikTok Growth Potential** — Your TikTok ER is 8.1% vs. competitor avg of 12.1%. Platform-specific hooks could close this 33% gap.

🔥 **Question Hook Trend** — @topcompetitor's "Question Hook" achieves 92% virality. Test 3 A/B variants in your niche.

---

## ⚡ Threats

🔴 **Competitor Volume Advantage:** @topcompetitor posts 10x more than you—risking audience fatigue toward their content but also expanding their reach faster. Counter with quality-over-quantity and strategic timing.

🔴 **Platform Algorithm Shifts:** Instagram prioritizes Reels under 15s. Your current format may lose visibility if not adapted.

---

## 📋 90-Day Action Plan

| Phase | Focus |
|-------|-------|
| **Week 1-2** | A/B test 3 short-form (≤15s) variants of your top emotional story. Track virality vs. current ${userAccount.avgDuration}s format. |
| **Week 3-4** | Increase posting to 5/day (split test: 3 shorts + 2 long-form). Monitor engagement rate changes. |
| **Week 5-8** | Launch "Question Hook" campaign on TikTok. Generate 10 variants via AI, post 1/day, measure 12.1% ER target. |
| **Week 9-12** | Collaboration push: Use high comment engagement to partner with 2-3 micro-influencers in your niche for cross-promotion. |

---

**Key Metrics to Track:**
- Current ER: **${userAccount.avgER}%** → Target: **${competitorAvgER.toFixed(1)}%**
- Current posts/day: **${userAccount.postsPerDay}** → Target: **5-8/day**
- Current avg duration: **${userAccount.avgDuration}s** → Target: **≤15s for shorts**`;
};

const generateFollowUpResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("tiktok") && lowerMessage.includes("hook")) {
    return `## 🎯 TikTok-Optimized Hooks

Based on your strategy and competitor analysis, here are **10 TikTok-optimized hooks** tailored for your Energetic & Educational style:

### Question Hooks (High Virality: 92%)
1. "What if I told you the secret to viral content is only 3 seconds long?"
2. "Why are 90% of creators doing THIS wrong?"
3. "Can you guess what top creators never tell you about growth?"

### Shock Hooks (High Virality: 88%)
4. "I gained 50K followers in 7 days using just ONE technique…"
5. "This mistake cost me 100K views. Don't make it."
6. "Nobody talks about this algorithm hack (until now)"

### Emotional Story Hooks (Your Signature: 87%)
7. "The moment everything changed for my content…"
8. "I almost gave up on creating, but then this happened"
9. "Here's what 2 years of content creation taught me"

### Challenge Hooks (Growing Trend: 85%)
10. "Try this for 7 days and watch your engagement explode"

---

**Recommended A/B Test:** Post hooks 1, 4, and 7 over the next week and compare CTR in the first 3 seconds.`;
  }
  
  if (lowerMessage.includes("question hook") || lowerMessage.includes("question variant")) {
    return `## 💡 Question Hook Variants

Based on @topcompetitor's 92% virality with question hooks, here are **10 variants** customized for your niche:

### Curiosity-Gap Questions
1. "What's the ONE thing viral creators do that you don't?"
2. "Ever wonder why some videos get millions while yours get hundreds?"
3. "Do you know the 3-second rule for hooks?"

### Challenge Questions
4. "Can you spot what's wrong with this video?"
5. "Think you know social media? Take this 5-second test"
6. "Ready to see the biggest mistake in your content?"

### Personal Connection Questions
7. "Why does posting feel so exhausting? Here's the truth…"
8. "Remember when growing was actually fun? Let's bring that back"
9. "Want to know why I stopped chasing trends?"

### Contrarian Questions
10. "What if everything you learned about hooks was wrong?"

---

**Implementation tip:** Start each video with one of these, then pause for 1 second before continuing. This creates a natural "hook" moment.`;
  }
  
  if (lowerMessage.includes("script") || lowerMessage.includes("short-form")) {
    return `## 🎬 Short-Form Script Variants (≤15s)

Here are **5 script variants** optimized for your Emotional Story style, all under 15 seconds:

---

### Script 1: The Revelation (14s)
\`\`\`
[0-3s] "I used to post 3 times a day..."
[3-7s] "...and get maybe 100 views."
[7-12s] "Then I discovered the 15-second rule."
[12-14s] "Now? 100K+ on every video."
\`\`\`

### Script 2: The Mistake (13s)
\`\`\`
[0-4s] "Stop making this editing mistake."
[4-8s] "Your first 3 seconds are everything."
[8-13s] "Hook them here, or lose them forever."
\`\`\`

### Script 3: The Secret (15s)
\`\`\`
[0-3s] "Nobody talks about this..."
[3-8s] "...but the algorithm loves ONE thing."
[8-12s] "Consistency beats perfection."
[12-15s] "Every. Single. Time."
\`\`\`

### Script 4: The Transformation (14s)
\`\`\`
[0-4s] "6 months ago: 500 followers."
[4-8s] "Today: 50,000."
[8-14s] "The only thing I changed? My hooks."
\`\`\`

### Script 5: The Challenge (12s)
\`\`\`
[0-3s] "Try this for 7 days."
[3-8s] "Post ONE video with a question hook."
[8-12s] "Thank me later. 📈"
\`\`\`

---

**Pro tip:** Record all 5 in one session, post one per day, and track which gets the highest watch time.`;
  }
  
  if (lowerMessage.includes("shorten") || lowerMessage.includes("15s") || lowerMessage.includes("duration")) {
    return `## ⏱️ Content Shortening Strategy

Based on your current avg duration of **28s** vs the optimal **≤15s**, here's your action plan:

### Step 1: Identify Cut Points
- **Remove:** Intros, outros, transitions over 1s
- **Keep:** Hook (0-3s), Value bomb (3-10s), CTA (10-15s)
- **Cut:** "Um"s, pauses, repeated phrases

### Step 2: The 15-Second Framework
| Seconds | Content |
|---------|---------|
| 0-3 | Hook (Question or Shock) |
| 3-8 | ONE key insight |
| 8-12 | Quick example or proof |
| 12-15 | CTA ("Follow for more") |

### Step 3: Quick Wins
1. Take your top 5 performing videos
2. Re-edit each to ≤15 seconds
3. Post as "Part 2" or "POV" versions
4. Compare engagement rates

### Expected Results
- **+40% watch-through rate** (industry benchmark)
- **+25% saves** (shorter = easier to rewatch)
- **+15% shares** (quicker consumption = easier to share)

---

Want me to generate specific script cuts for your top-performing videos?`;
  }
  
  if (lowerMessage.includes("cadence") || lowerMessage.includes("schedule") || lowerMessage.includes("posting")) {
    return `## 📅 Optimized Content Cadence Plan

Based on your current **2.3 posts/day** vs top performers' **8-10/day**, here's a realistic scaling plan:

### Phase 1: Week 1-2 (Current → 4/day)
| Time | Content Type | Platform |
|------|--------------|----------|
| 9 AM | Hook video | TikTok |
| 12 PM | Story/Behind-scenes | Instagram |
| 6 PM | Main content | TikTok + IG |
| 9 PM | Trending audio/remix | TikTok |

### Phase 2: Week 3-4 (4 → 6/day)
Add:
- 7 AM educational short
- 3 PM repurposed clip

### Phase 3: Week 5+ (6 → 8/day)
Add:
- 11 AM user comment response
- 5 PM collaboration/duet

### Content Batching Strategy
**Sunday:** Film 10 main videos (2 hours)
**Monday:** Edit all + schedule
**Daily:** 2 reactive posts (comments, trends)

### Optimal Posting Times (Your Audience)
🔥 **Best:** 6-9 PM (your competitors see 18% higher ER)
⚠️ **Your current peak:** 2 PM (suboptimal)

---

Would you like me to generate a daily checklist from this plan?`;
  }
  
  if (lowerMessage.includes("checklist") || lowerMessage.includes("daily")) {
    return `## ✅ Daily Content Checklist

Based on your strategy, here's your optimized daily workflow:

### Morning Routine (30 min)
- [ ] Check analytics from yesterday's posts
- [ ] Review competitor activity (5 min max)
- [ ] Post first video (9 AM slot)
- [ ] Respond to top 5 comments from yesterday

### Midday (20 min)
- [ ] Post second video (12 PM slot)
- [ ] Engage with 10 posts in your niche
- [ ] Check trending sounds/hashtags

### Evening (45 min)
- [ ] Post main content (6 PM slot)
- [ ] Go live or post stories (optional)
- [ ] Post final video (9 PM slot)
- [ ] Respond to all comments within 1 hour

### Weekly Batch Day (Sunday - 2 hours)
- [ ] Film 7-10 videos
- [ ] Edit and add captions
- [ ] Schedule for the week
- [ ] Plan 3 collaboration outreach messages

### Key Metrics to Track Daily
| Metric | Target | Your Current |
|--------|--------|--------------|
| Posts | 4-6 | 2.3 |
| Comments replied | 20+ | — |
| ER | 6.8% | 4.2% |
| Watch-through | 80%+ | — |

---

**Pro tip:** Print this and check off each item. Consistency > perfection!`;
  }
  
  if (lowerMessage.includes("a/b test") || lowerMessage.includes("variant")) {
    return `## 🧪 A/B Test Variants

Here are **10 A/B test variants** for your next content experiment:

### Hook A/B Tests
| Version A | Version B |
|-----------|-----------|
| Question hook | Statement hook |
| "Why does..." | "Here's why..." |
| Soft open | Jump-cut open |

### Format A/B Tests
| Version A | Version B |
|-----------|-----------|
| 15s video | 28s video |
| Talking head | Text overlay |
| Vertical | Square crop |

### CTA A/B Tests
| Version A | Version B |
|-----------|-----------|
| "Follow for more" | "Save this" |
| End-screen CTA | Mid-video CTA |
| Verbal only | Text + verbal |

### Posting Time A/B Tests
| Version A | Version B |
|-----------|-----------|
| 9 AM post | 9 PM post |
| Weekday | Weekend |
| During peak | Off-peak |

---

### Recommended First Test
**Hypothesis:** Shorter videos (≤15s) get higher ER than your current 28s average

**Test:** Post 5 short-form (≤15s) + 5 regular length over 10 days
**Measure:** ER, watch-through %, shares
**Expected:** +40% engagement on short-form

Would you like me to design a specific A/B testing calendar?`;
  }
  
  // Default response
  return `Based on your strategy and analytics data, here's my analysis:

${userMessage.length > 50 ? 'That\'s a great question! ' : ''}

Looking at your current metrics:
- **ER:** 4.2% vs competitor avg 6.8%
- **Posts/day:** 2.3 vs top performers 8-10
- **Avg duration:** 28s vs optimal ≤15s

To address your request, I recommend:

1. **Focus on your strength** — Your Emotional Story hooks are performing at 87% virality. Double down on this format.

2. **Close the gap** — The biggest opportunity is posting frequency. Even increasing to 4/day would be a 73% improvement.

3. **Test and iterate** — Use the 90-day plan as your guide, but adapt based on what works for YOUR audience.

---

Would you like me to:
- Generate specific hooks for your niche?
- Create a detailed posting schedule?
- Develop A/B test variants?

Just let me know what would be most helpful!`;
};

export function StrategyProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<StrategySession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const createSession = useCallback(() => {
    const newSession: StrategySession = {
      id: `session-${Date.now()}`,
      userId: "user-1",
      title: `Strategy ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      primaryAccountId: "@yourbrand",
      competitorIds: ["@topcompetitor", "@mrbeast", "@khaby.lame", "@charli", "@addison"],
      platformScope: ["Instagram", "TikTok", "YouTube"],
      dateRange: "Last 7 days",
      messages: [],
      currentVersion: 1,
    };

    // Add initial strategy message
    const strategyMessage: StrategyMessage = {
      id: `msg-${Date.now()}`,
      sessionId: newSession.id,
      role: "assistant",
      content: generateInitialStrategy(1),
      createdAt: new Date(),
      metadata: { versionNumber: 1 },
    };

    newSession.messages = [strategyMessage];

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
  }, [activeSessionId]);

  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, title: newTitle, updatedAt: new Date() } : s
      )
    );
  }, []);

  const getActiveSession = useCallback(() => {
    return sessions.find((s) => s.id === activeSessionId) || null;
  }, [sessions, activeSessionId]);

  const addMessage = useCallback(
    (sessionId: string, message: Omit<StrategyMessage, "id" | "sessionId" | "createdAt">) => {
      const newMessage: StrategyMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        createdAt: new Date(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, newMessage], updatedAt: new Date() }
            : s
        )
      );

      return newMessage;
    },
    []
  );

  const regenerateStrategy = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        
        const newVersion = s.currentVersion + 1;
        const regeneratedMessage: StrategyMessage = {
          id: `msg-${Date.now()}`,
          sessionId,
          role: "assistant",
          content: generateInitialStrategy(newVersion),
          createdAt: new Date(),
          metadata: { versionNumber: newVersion },
        };

        return {
          ...s,
          messages: [...s.messages, regeneratedMessage],
          currentVersion: newVersion,
          updatedAt: new Date(),
        };
      })
    );
  }, []);

  const sendUserMessage = useCallback(
    (sessionId: string, content: string) => {
      // Add user message
      const userMessage: StrategyMessage = {
        id: `msg-${Date.now()}`,
        sessionId,
        role: "user",
        content,
        createdAt: new Date(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, userMessage], updatedAt: new Date() }
            : s
        )
      );

      // Simulate streaming response
      setIsStreaming(true);
      setTimeout(() => {
        const responseContent = generateFollowUpResponse(content);
        const assistantMessage: StrategyMessage = {
          id: `msg-${Date.now()}-response`,
          sessionId,
          role: "assistant",
          content: responseContent,
          createdAt: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, assistantMessage], updatedAt: new Date() }
              : s
          )
        );
        setIsStreaming(false);
      }, 1500);
    },
    []
  );

  return (
    <StrategyContext.Provider
      value={{
        sessions,
        activeSessionId,
        isLoading,
        isStreaming,
        createSession,
        deleteSession,
        renameSession,
        setActiveSession: setActiveSessionId,
        getActiveSession,
        addMessage,
        regenerateStrategy,
        sendUserMessage,
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
}

export function useStrategy() {
  const context = useContext(StrategyContext);
  if (context === undefined) {
    throw new Error("useStrategy must be used within a StrategyProvider");
  }
  return context;
}
