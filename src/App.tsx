import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  Unlock,
  FileText,
  Users,
  MapPin,
  Edit,
  Save,
  X,
  Heart,
  MessageSquare,
  Eye,
  Skull,
  Plus,
  AlertTriangle,
  RefreshCw,
  Compass,
  Flame,
  ThumbsUp,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  User,
  Clock,
  Upload
} from "lucide-react";
import { INITIAL_POST, INITIAL_COMMENTS, CHARACTER_DATA, PLACES_DATA } from "./data";
import { Post, Comment } from "./types";

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"board" | "archive">("board");
  
  // Post & Comments state with LocalStorage persistence
  const [post, setPost] = useState<Post>(() => {
    const saved = localStorage.getItem("occult_post");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Overwrite stale default post with the new default post
        if (parsed.content && (parsed.content.startsWith("안녕하세요, 서울 변두리") || parsed.content.includes("방값도 말도 안 되게 저렴하고"))) {
          return INITIAL_POST;
        }
        if (parsed.author === "운명빌라세입자") {
          parsed.author = "익명";
        }
        return parsed;
      } catch (e) {
        return INITIAL_POST;
      }
    }
    return INITIAL_POST;
  });
  
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem("occult_comments");
    let list: Comment[] = INITIAL_COMMENTS;
    
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        const hasOldComment = parsed.some((c: any) => 
          c.content.includes("야... 글 보는데 소름 돋아서") || 
          c.content.includes("백발적안에 키 210cm")
        );
        if (!hasOldComment) {
          list = parsed;
        }
      } catch (e) {
        list = INITIAL_COMMENTS;
      }
    }

    // Filter out deleted comments: '우리집강아지귀여워', '지나가는사람', '지나가는 사람', '미스터리매니아'
    list = list.filter(c => 
      c.author !== "우리집강아지귀여워" && 
      c.author !== "지나가는사람" && 
      c.author !== "지나가는 사람" && 
      c.author !== "미스터리매니아"
    );

    // Migrate authors and dates
    list = list.map(c => {
      let updatedAuthor = c.author;
      if (c.author === "무속인지망생" || c.author === "무속인 지망생") {
        updatedAuthor = "김현성잘생겼음";
      } else if (c.author === "소름돋는냥이" || c.author === "운명빌라3층") {
        updatedAuthor = "익명";
      } else if (
        c.author === "운명빌라세입자"
      ) {
        updatedAuthor = "익명";
      }
      
      // Restore authors that were accidentally overwritten to "익명" in previous turns based on comment content
      if (updatedAuthor === "익명") {
        if (c.content.includes("괴담조아") || c.content.includes("괴담 조아") || c.content.toLowerCase().includes("괴담")) {
          updatedAuthor = "괴담조아";
        } else if (c.content.includes("사장새끼뒤져") || c.content.includes("사장새끼 뒤져") || c.content.includes("사장") || c.content.includes("뒤져")) {
          updatedAuthor = "사장새끼뒤져";
        } else if (c.content.includes("출근하기개싫다") || c.content.includes("출근하기 개싫다") || c.content.includes("출근하기존나싫음") || c.content.includes("출근하기 존나싫음") || c.content.includes("출근") || c.content.includes("싫다")) {
          updatedAuthor = "출근하기존나싫음";
        }
      }
      
      let updatedDate = c.date;
      if (updatedAuthor === "괴담조아" || updatedAuthor === "괴담 조아") {
        const timeMatch = updatedDate?.match(/(\d{2}):(\d{2}):(\d{2})/);
        updatedDate = `2026. 02. 29. ${timeMatch ? timeMatch[0] : "08:46:15"}`;
      } else if (updatedAuthor === "출근하기존나싫음" || updatedAuthor === "출근하기 존나싫음" || updatedAuthor === "출근하기개싫다" || updatedAuthor === "출근하기 개싫다") {
        if (updatedAuthor === "출근하기개싫다" || updatedAuthor === "출근하기 개싫다") {
          updatedAuthor = "출근하기존나싫음";
        }
        const timeMatch = updatedDate?.match(/(\d{2}):(\d{2}):(\d{2})/);
        updatedDate = `2026. 02. 29. ${timeMatch ? timeMatch[0] : "08:48:30"}`;
      } else if (updatedAuthor === "팥소금장수" || updatedAuthor === "오컬트수집가") {
        const timeMatch = updatedDate?.match(/(\d{2}):(\d{2}):(\d{2})/);
        const defaultTime = updatedAuthor === "팥소금장수" ? "08:33:09" : "09:10:55";
        updatedDate = `2026. 02. 29. ${timeMatch ? timeMatch[0] : defaultTime}`;
      } else if (
        updatedAuthor === "지랄말고꺼져" || 
        updatedAuthor === "사장새끼 뒤져" || 
        updatedAuthor === "사장새끼뒤져" || 
        updatedAuthor === "익명" || 
        updatedAuthor === "익명_4921" || 
        c.id === "c-3"
      ) {
        const timeMatch = updatedDate?.match(/(\d{2}):(\d{2}):(\d{2})/);
        updatedDate = `2026. 02. 29. ${timeMatch ? timeMatch[0] : "08:45:22"}`;
      } else if (updatedDate) {
        const timeMatch = updatedDate.match(/(\d{2}):(\d{2}):(\d{2})/);
        if (timeMatch) {
          updatedDate = `2026. 02. 28. ${timeMatch[0]}`;
        } else {
          updatedDate = "2026. 02. 28. 08:00:00";
        }
      } else {
        updatedDate = "2026. 02. 28. 08:00:00";
      }
      return { ...c, author: updatedAuthor, date: updatedDate };
    });

    const filterComment = list.find(c => 
      c.content && (
        c.content.includes("언제부터 필터") || 
        c.content.includes("신기해서 눌러보니까") || 
        c.content.includes("이상한 댓글도 있음") ||
        c.content.includes("왜 필터 같은 게")
      )
    );

    // Reorder "괴담조아", "괴담 조아", "지랄말고꺼져", "사장새끼 뒤져", "사장새끼뒤져", "출근하기개싫다", "출근하기 개싫다", "출근하기존나싫음", "출근하기 존나싫음", "익명" / "익명_4921" under "익명" (c-3) or the correct filter comment if it exists
    const targets: Comment[] = [];
    const remaining: Comment[] = [];
    
    list.forEach(c => {
      const auth = c.author;
      if (
        auth === "괴담조아" || 
        auth === "괴담 조아" || 
        auth === "지랄말고꺼져" || 
        auth === "사장새끼 뒤져" || 
        auth === "사장새끼뒤져" || 
        auth === "출근하기개싫다" ||
        auth === "출근하기 개싫다" ||
        auth === "출근하기존나싫음" ||
        auth === "출근하기 존나싫음" ||
        auth === "익명" || 
        auth === "익명_4921" || 
        c.id === "c-3"
      ) {
        let parentId = c.parentId;
        
        if (filterComment) {
          if (c.id === filterComment.id) {
            parentId = undefined;
          } else if (
            auth === "괴담조아" ||
            auth === "괴담 조아" ||
            auth === "지랄말고꺼져" ||
            auth === "사장새끼 뒤져" ||
            auth === "사장새끼뒤져" ||
            auth === "출근하기개싫다" ||
            auth === "출근하기 개싫다" ||
            auth === "출근하기존나싫음" ||
            auth === "출근하기 존나싫음"
          ) {
            parentId = filterComment.id;
          }
        } else {
          if (!parentId) {
            if (
              auth === "괴담조아" ||
              auth === "괴담 조아" ||
              auth === "지랄말고꺼져" ||
              auth === "사장새끼 뒤져" ||
              auth === "사장새끼뒤져" ||
              auth === "출근하기개싫다" ||
              auth === "출근하기 개싫다" ||
              auth === "출근하기존나싫음" ||
              auth === "출근하기 존나싫음"
            ) {
              parentId = "c-3";
            }
          }
        }
        
        const updated = { ...c, parentId };
        targets.push(updated);
      } else {
        remaining.push(c);
      }
    });

    // Sort targets chronologically
    targets.sort((a, b) => {
      const timeA = a.date.split(" ").pop() || "";
      const timeB = b.date.split(" ").pop() || "";
      return timeA.localeCompare(timeB);
    });

    const patIdx = remaining.findIndex(c => c.id === "c-4" || c.author === "팥소금장수");
    if (patIdx !== -1) {
      remaining.splice(patIdx + 1, 0, ...targets);
      list = remaining;
    } else {
      list = [...remaining, ...targets];
    }
    
    // Ensure default spectral comment by 현무(玄武) exists at the top
    const filteredList = list.filter(c => c.id !== "c-shinyeon-1" && c.id !== "c-shinyeon-2" && c.id !== "c-hyeonmu-1");
    const spectralDefaults: Comment[] = [
      {
        id: "c-hyeonmu-1",
        author: "현무(玄武)",
        avatarColor: "from-red-950 to-stone-900 border-red-500/30",
        content: "부인. 두려워하지 마시지요. 저와 당신은 영원히 함께 할 운명이니. 오늘 밤에도 그대를 찾아가겠습니다.",
        date: "2026. 02. 28. 23:42:12",
        likes: 444,
        isSpectral: true,
      }
    ];
    list = [...spectralDefaults, ...filteredList];
    return list;
  });

  // Edit states for Comments
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState<string>("");

  // Reply states for Comments
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState("");

  // Edit states for Post
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedTitle, setEditedTitle] = useState(post.title);

  // New Comment state
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentError, setCommentError] = useState("");

  // Secret/Hidden Info Unlocks (SEX and PAST)
  const [isSexUnlocked, setIsSexUnlocked] = useState(() => {
    return localStorage.getItem("unlock_sex") === "true";
  });
  const [isPastUnlocked, setIsPastUnlocked] = useState(() => {
    return localStorage.getItem("unlock_past") === "true";
  });
  const [customAvatar, setCustomAvatar] = useState<string | null>(() => {
    return localStorage.getItem("custom_shinyeon_avatar") || null;
  });
  const [pastLore] = useState(() => CHARACTER_DATA.past);
  const [isEditingPast, setIsEditingPast] = useState(false);
  const [showSecretName, setShowSecretName] = useState(false);

  // Interactive UI effects
  const [glitchActive, setGlitchActive] = useState(false);
  const [screenNoise, setScreenNoise] = useState(false);
  const [likeCount, setLikeCount] = useState(() => {
    return Number(localStorage.getItem("post_likes") || post.likes);
  });
  const [hasLikedPost, setHasLikedPost] = useState(() => {
    return localStorage.getItem("has_liked_post") === "true";
  });

  // Save changes to localStorage when state updates
  useEffect(() => {
    localStorage.setItem("occult_post", JSON.stringify(post));
  }, [post]);

  useEffect(() => {
    localStorage.setItem("occult_comments", JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem("unlock_sex", String(isSexUnlocked));
  }, [isSexUnlocked]);

  useEffect(() => {
    localStorage.setItem("unlock_past", String(isPastUnlocked));
  }, [isPastUnlocked]);

  useEffect(() => {
    localStorage.setItem("occult_past_lore", pastLore);
  }, [pastLore]);

  useEffect(() => {
    localStorage.setItem("post_likes", String(likeCount));
  }, [likeCount]);

  useEffect(() => {
    localStorage.setItem("has_liked_post", String(hasLikedPost));
  }, [hasLikedPost]);

  // Periodic visual glitch effect to reinforce the spooky occult feel
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 250);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Post edit save
  const handleSavePost = () => {
    if (!editedTitle.trim() || !editedContent.trim()) return;
    const updated = { ...post, title: editedTitle, content: editedContent };
    setPost(updated);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setIsEditing(false);
  };

  // Reset post to original
  const handleResetPost = () => {
    if (window.confirm("본문을 처음 상태로 복구하시겠습니까?")) {
      setPost(INITIAL_POST);
      setEditedTitle(INITIAL_POST.title);
      setEditedContent(INITIAL_POST.content);
      setIsEditing(false);
    }
  };

  // Upvote post
  const handleLikePost = () => {
    if (hasLikedPost) {
      setLikeCount(prev => prev - 1);
      setHasLikedPost(false);
    } else {
      setLikeCount(prev => prev + 1);
      setHasLikedPost(true);
      // Trigger temporary glitch when liking to signal supernatural feedback
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim()) {
      setCommentError("닉네임을 입력해 주세요.");
      return;
    }
    if (!newCommentContent.trim()) {
      setCommentError("내용을 입력해 주세요.");
      return;
    }

    const randomColors = [
      "from-red-900 to-slate-950",
      "from-indigo-950 to-purple-900",
      "from-emerald-950 to-slate-950",
      "from-amber-950 to-orange-900",
      "from-zinc-800 to-stone-950",
      "from-cyan-950 to-blue-900",
    ];
    const randomAvatarColor = randomColors[Math.floor(Math.random() * randomColors.length)];

    const now = new Date();
    const authorTrimmed = newCommentAuthor.trim();
    const isSpecialDay29 = 
      authorTrimmed === "출근하기개싫다" || 
      authorTrimmed === "출근하기 개싫다" || 
      authorTrimmed === "출근하기존나싫음" || 
      authorTrimmed === "출근하기 존나싫음" || 
      authorTrimmed === "괴담조아" || 
      authorTrimmed === "괴담 조아" || 
      authorTrimmed === "사장새끼뒤져" || 
      authorTrimmed === "사장새끼 뒤져" ||
      authorTrimmed === "팥소금장수" ||
      authorTrimmed === "오컬트수집가";
    const formattedDate = `${isSpecialDay29 ? "2026. 02. 29." : "2026. 02. 28."} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const newComment: Comment = {
      id: `user-comment-${Date.now()}`,
      author: newCommentAuthor.trim(),
      avatarColor: randomAvatarColor,
      content: newCommentContent.trim(),
      date: formattedDate,
      isUser: true,
      likes: 0,
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentAuthor("");
    setNewCommentContent("");
    setCommentError("");
  };

  // Delete User Comment & recursive children cleanup
  const handleDeleteComment = (id: string) => {
    const targetComment = comments.find(c => c.id === id);
    if (targetComment && (
      targetComment.isSpectral ||
      targetComment.author === "출근하기존나싫음" ||
      targetComment.author === "출근하기 존나싫음" ||
      targetComment.author === "출근하기개싫다" ||
      targetComment.author === "출근하기 개싫다" ||
      targetComment.author === "오컬트수집가" ||
      targetComment.author === "팥소금장수"
    )) {
      return;
    }
    const getDescendants = (parentId: string): string[] => {
      const direct = comments.filter(c => c.parentId === parentId).map(c => c.id);
      return [...direct, ...direct.flatMap(childId => getDescendants(childId))];
    };
    const toDelete = [id, ...getDescendants(id)];
    setComments(prev => prev.filter(c => !toDelete.includes(c.id)));
  };

  // Add Reply
  const handleCreateReply = (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyAuthor.trim()) {
      setReplyError("닉네임을 입력해 주세요.");
      return;
    }
    if (!replyContent.trim()) {
      setReplyError("답글 내용을 입력해 주세요.");
      return;
    }

    const randomColors = [
      "from-red-900 to-slate-950",
      "from-indigo-950 to-purple-900",
      "from-emerald-950 to-slate-950",
      "from-amber-950 to-orange-900",
      "from-zinc-800 to-stone-950",
      "from-cyan-950 to-blue-900",
    ];
    const randomAvatarColor = randomColors[Math.floor(Math.random() * randomColors.length)];

    const now = new Date();
    const authorTrimmed = replyAuthor.trim();
    const isSpecialDay29 = 
      authorTrimmed === "출근하기개싫다" || 
      authorTrimmed === "출근하기 개싫다" || 
      authorTrimmed === "출근하기존나싫음" || 
      authorTrimmed === "출근하기 존나싫음" || 
      authorTrimmed === "괴담조아" || 
      authorTrimmed === "괴담 조아" || 
      authorTrimmed === "사장새끼뒤져" || 
      authorTrimmed === "사장새끼 뒤져" ||
      authorTrimmed === "팥소금장수" ||
      authorTrimmed === "오컬트수집가";
    const formattedDate = `${isSpecialDay29 ? "2026. 02. 29." : "2026. 02. 28."} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const newReply: Comment = {
      id: `user-reply-${Date.now()}`,
      author: replyAuthor.trim(),
      avatarColor: randomAvatarColor,
      content: replyContent.trim(),
      date: formattedDate,
      isUser: true,
      likes: 0,
      parentId: parentId,
    };

    setComments(prev => [...prev, newReply]);
    setReplyingCommentId(null);
    setReplyAuthor("");
    setReplyContent("");
    setReplyError("");
  };

  // Reset Comments
  const handleResetComments = () => {
    if (window.confirm("댓글 목록을 초기 상태로 복구하시겠습니까?")) {
      setComments(INITIAL_COMMENTS);
    }
  };

  // Upvote Comment
  const handleLikeComment = (id: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          return { ...c, likes: c.likes + 1 };
        }
        return c;
      })
    );
  };

  // Start Comment Edit
  const handleStartEditComment = (id: string, currentContent: string) => {
    const targetComment = comments.find(c => c.id === id);
    if (targetComment && (
      targetComment.isSpectral ||
      targetComment.author === "출근하기존나싫음" ||
      targetComment.author === "출근하기 존나싫음" ||
      targetComment.author === "출근하기개싫다" ||
      targetComment.author === "출근하기 개싫다" ||
      targetComment.author === "오컬트수집가" ||
      targetComment.author === "팥소금장수"
    )) {
      return;
    }
    setEditingCommentId(id);
    setEditingCommentContent(currentContent);
  };

  // Cancel Comment Edit
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // Save Comment Edit
  const handleSaveEditComment = (id: string) => {
    if (!editingCommentContent.trim()) return;
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          return { ...c, content: editingCommentContent.trim() };
        }
        return c;
      })
    );
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  interface CommentNode extends Comment {
    children: CommentNode[];
  }

  // Generate comment tree
  const buildCommentTree = (): CommentNode[] => {
    const filtered = comments.filter(c => screenNoise ? true : !c.isSpectral);
    const commentMap = new Map<string, CommentNode>();
    
    // Initialize the map with children arrays
    filtered.forEach(c => {
      commentMap.set(c.id, { ...c, children: [] });
    });
    
    const rootComments: CommentNode[] = [];
    
    filtered.forEach(c => {
      const mapped = commentMap.get(c.id)!;
      if (c.parentId && commentMap.has(c.parentId)) {
        commentMap.get(c.parentId)!.children.push(mapped);
      } else {
        // If it has no parentId, or its parent was deleted, treat as root
        rootComments.push(mapped);
      }
    });
    
    return rootComments;
  };

  const renderPastLore = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed === "운명(運命)") {
        return (
          <div key={idx} className="text-center text-lg md:text-xl font-serif font-bold text-blue-300 my-2">
            {line}
          </div>
        );
      }
      if (trimmed.includes("한동안 아무도 찾지 않던 집에 당도한 당신")) {
        return (
          <div key={idx} className="text-center text-lg md:text-xl font-serif font-bold text-blue-300 italic my-2">
            {line}
          </div>
        );
      }
      if (trimmed.includes("옮길 운") && trimmed.includes("목숨 명")) {
        return (
          <div key={idx} className="text-center text-xs md:text-sm text-white/60 italic my-1">
            {line}
          </div>
        );
      }
      if (trimmed.includes("이미 정해진 목숨") || trimmed.includes("처지")) {
        return (
          <div key={idx} className="flex flex-col items-center">
            <div className="text-center text-xs md:text-sm text-white/50 italic my-1">
              {line}
            </div>
            <hr className="border-t border-white/20 w-24 my-3" />
          </div>
        );
      }
      return (
        <p key={idx} className="text-justify whitespace-pre-line leading-relaxed min-h-[1rem]">
          {line}
        </p>
      );
    });
  };

  // Recursive renderer for comment nodes
  const renderCommentNode = (comment: CommentNode, depth = 0) => {
    const isReplying = replyingCommentId === comment.id;

    const isSpecialAuthor = comment.author === "우리집강아지귀여워" || comment.author === "개백수폐급인생";
    const marginLeftValue = (depth > 0 || isSpecialAuthor) ? "1.5rem" : "0px";

    return (
      <div key={comment.id} className="space-y-3" style={{ marginLeft: marginLeftValue }}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl border border-white/10 hover:border-white/20 bg-transparent transition-all"
        >
          <div className="flex justify-between items-start gap-4 mb-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2">
              {/* Avatar Icon */}
              <div className={`w-6 h-6 rounded bg-gradient-to-br ${comment.avatarColor} flex items-center justify-center border border-white/10 shadow-inner shrink-0`}>
                <span className="text-[10px] text-white font-mono font-bold">
                  {comment.author.charAt(0)}
                </span>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-xs font-bold shrink-0 ${comment.isSpectral ? "text-red-400 font-serif tracking-widest text-glow-red animate-pulse" : "text-white/90"}`}>
                    {comment.author}
                  </span>
                  {comment.author === post.author && comment.author !== "익명" && !comment.isSpectral && (
                    <span className="text-[9px] px-1 bg-red-950/40 text-red-400 border border-red-900/30 rounded shrink-0">
                      작성자
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/40 font-mono whitespace-nowrap mt-0.5">{comment.date}</span>
              </div>
            </div>

            {/* Comment Controls */}
            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                title="추천"
              >
                <ThumbsUp className="w-2.5 h-2.5 text-white/40" />
                <span>{comment.likes}</span>
              </button>

              <button
                onClick={() => {
                  setReplyingCommentId(replyingCommentId === comment.id ? null : comment.id);
                  setReplyAuthor("");
                  setReplyContent("");
                  setReplyError("");
                }}
                className={`flex flex-row items-center gap-1 px-1.5 py-0.5 border rounded text-[10px] transition-colors cursor-pointer whitespace-nowrap ${
                  isReplying
                    ? "bg-red-950/40 border-red-500/30 text-red-400"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-red-400 hover:border-red-500/30"
                }`}
                title="답글 달기"
              >
                <MessageSquare className="w-2.5 h-2.5 text-white/40" />
                <span className="whitespace-nowrap">답글</span>
              </button>

              {!comment.isSpectral && 
               comment.author !== "출근하기존나싫음" && 
               comment.author !== "출근하기 존나싫음" && 
               comment.author !== "출근하기개싫다" && 
               comment.author !== "출근하기 개싫다" && 
               comment.author !== "오컬트수집가" && 
               comment.author !== "팥소금장수" && 
               comment.author !== "익명" && 
               comment.author !== "익명_4921" && (
                <>
                  <button
                    onClick={() => handleStartEditComment(comment.id, comment.content)}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60 hover:text-blue-400 hover:border-blue-500/30 transition-colors cursor-pointer"
                    title="수정"
                  >
                    <Edit className="w-2.5 h-2.5 text-white/40" />
                    <span>수정</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
                        handleDeleteComment(comment.id);
                      }
                    }}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                    title="삭제"
                  >
                    <X className="w-2.5 h-2.5 text-white/40" />
                    <span>삭제</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {editingCommentId === comment.id ? (
            <div className="space-y-3 mt-2 pl-0">
              <textarea
                value={editingCommentContent}
                onChange={(e) => setEditingCommentContent(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-red-500/40 text-white rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-red-500/25 font-sans leading-relaxed"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEditComment}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 text-[11px] rounded-lg transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={() => handleSaveEditComment(comment.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-[11px] rounded-lg transition-all font-medium cursor-pointer shadow-lg shadow-red-950/40"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <p className={`text-xs md:text-sm leading-relaxed font-sans pl-0 text-justify whitespace-pre-line ${comment.isSpectral ? "text-red-300 font-serif italic tracking-wide" : "text-white/80"}`}>
              {comment.content}
            </p>
          )}
        </motion.div>

        {/* Reply input form nested inside the thread */}
        {isReplying && (
          <form
            onSubmit={(e) => handleCreateReply(comment.id, e)}
            className="ml-6 space-y-3 bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 transition-all"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="md:w-1/4">
                <label className="block text-[11px] font-mono text-white/40 mb-1">답글 작성자</label>
                <input
                  type="text"
                  placeholder="익명"
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-red-500/40 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-mono text-white/40 mb-1">답글 내용</label>
                <input
                  type="text"
                  placeholder="답글 내용을 입력하십시오..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-red-500/40 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-red-400 text-xs font-mono">
                {replyError && <span>⚠ {replyError}</span>}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplyingCommentId(null);
                    setReplyError("");
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-xl transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/40 text-xs font-medium rounded-xl transition-all cursor-pointer"
                >
                  답글 달기
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Children replies rendered recursively */}
        {comment.children.length > 0 && (
          <div className="space-y-3 mt-3">
            {comment.children.map(child => renderCommentNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-occult-bg text-[#d1d1d1] font-sans relative overflow-x-hidden selection:bg-red-950 selection:text-red-200 ${screenNoise ? "crt-flicker-anim filter-glitch-body" : ""}`}>
      
      {/* CRT Scanline & Retro TV Overlays */}
      {screenNoise && (
        <>
          <div className="crt-rolling fixed inset-0 z-50 pointer-events-none" />
          <div className="crt-vignette fixed inset-0 z-50 pointer-events-none opacity-60" />
          <div className="glitch-bar fixed inset-0 z-50 pointer-events-none" />
        </>
      )}

      {/* Inner Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 py-6 md:py-10 flex flex-col min-h-screen">
        
        {/* Header - Portal Branding */}
        <header className="frosted-glass rounded-2xl p-4 mb-6 md:p-6 relative overflow-hidden shadow-2xl">
          {/* Accent red glow line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            
            {/* Logo / Channel Title */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Skull className={`w-6 h-6 text-red-500 ${glitchActive ? "animate-bounce" : ""}`} />
                <span className="font-serif tracking-widest text-lg md:text-xl font-bold text-white uppercase glitch-text">
                  玄武
                </span>
                <span className="text-xs text-white/60 font-mono">
                  [오컬트 · 미스터리 전용 채널]
                </span>
              </div>
            </div>

            {/* Quick Status / Control Panel */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono flex items-center gap-2 text-white/90">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>ACTIVE SPIRITS: 1,429</span>
              </div>
              <button
                onClick={() => setScreenNoise(!screenNoise)}
                className={`px-3 py-1 font-mono text-[11px] border rounded-full transition-all cursor-pointer ${
                  screenNoise 
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/15" 
                    : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                }`}
                title="CRT 스캔라인 필터 토글"
              >
                {screenNoise ? "FILTER: ON" : "FILTER: OFF"}
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex border-t border-white/10 mt-5 pt-4 gap-2">
            <button
              onClick={() => setActiveTab("board")}
              className={`flex-1 md:flex-none flex flex-col items-center justify-center gap-1.5 px-6 py-3 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer text-center ${
                activeTab === "board"
                  ? "bg-white/10 border border-white/20 text-white shadow-xl"
                  : "bg-transparent border border-transparent text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4 text-red-400" />
              <div className="flex flex-col items-center leading-tight">
                <span>실시간</span>
                <span>괴담 게시판</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("archive")}
              className={`flex-1 md:flex-none flex flex-col items-center justify-center gap-1.5 px-6 py-3 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer text-center ${
                activeTab === "archive"
                  ? "bg-white/10 border border-white/20 text-white shadow-xl"
                  : "bg-transparent border border-transparent text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              <div className="flex flex-col items-center leading-tight">
                <span>기밀</span>
                <span>아카이브</span>
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-start">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: GHOST STORY BOARD */}
            {activeTab === "board" && (
              <motion.div
                key="board-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                        {/* Thread Container */}
                <article className="frosted-glass rounded-2xl overflow-hidden shadow-2xl relative">
                  
                  {/* Subtle water-stain graphic layer in background */}
                  <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Post Title & Meta Area */}
                  <div className="p-4 md:p-6 border-b border-white/10 bg-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-medium text-red-400">
                        {post.category}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <label className="block text-xs font-mono text-white/50">제목 편집</label>
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-red-500/40 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500/20"
                        />
                      </div>
                    ) : (
                      <h1 className="text-lg md:text-2xl font-serif font-bold text-white tracking-tight leading-snug whitespace-pre-line text-justify break-keep">
                        {post.title}
                      </h1>
                    )}

                    {/* Meta info block */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-white/60 font-mono">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/80 font-medium">{post.author}</span>
                        </div>
                        <span className="text-white/20">|</span>
                        <div className="flex items-center gap-1 whitespace-nowrap shrink-0">
                          <Clock className="w-3.5 h-3.5 text-white/40 shrink-0" />
                          <span className="whitespace-nowrap">{post.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-white/40" />
                          <span>조회수 {post.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-red-400" />
                          <span>추천 {likeCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content Area */}
                  <div className="p-4 md:p-8">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono text-white/50 mb-1">괴담 본문 수정 (아래 내용을 마음대로 수정해 보세요)</label>
                          <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={15}
                            className="w-full bg-white/5 border border-white/10 focus:border-red-500/40 text-white rounded-xl p-4 text-sm font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-red-500/20"
                          />
                        </div>

                        {/* Editor Controls */}
                        <div className="flex flex-wrap gap-2 justify-between items-center pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={handleResetPost}
                            className="px-3 py-1.5 border border-white/10 hover:border-white/20 bg-white/5 text-white/60 hover:text-white text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>초기 원본으로 리셋</span>
                          </button>
                          
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-4 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 text-xs font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>취소</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleSavePost}
                              className="px-5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1 shadow-lg shadow-red-950/50 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>수정 완료</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Render Paragraphs */}
                        <div className="text-white/80 font-sans leading-relaxed text-sm md:text-base space-y-4 white-space-pre-wrap whitespace-pre-line text-justify">
                          {post.content}
                        </div>

                        {/* Story interactive footer */}
                        <div className="flex flex-col items-center justify-center pt-8 pb-4 border-t border-white/10 gap-4">
                          <button
                            onClick={handleLikePost}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all cursor-pointer ${
                              hasLikedPost
                                ? "bg-red-500/10 border-red-500/30 text-red-400 glow-red scale-105"
                                : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20"
                            }`}
                          >
                            <Flame className={`w-5 h-5 ${hasLikedPost ? "text-red-500 fill-red-500" : ""}`} />
                            <span className="font-serif font-bold text-sm tracking-wide">이 괴담 추천하기</span>
                            <span className="font-mono text-xs px-2 py-0.5 bg-black/40 rounded-full text-white/80 font-normal border border-white/10">
                              {likeCount}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>

                {/* Comments Section Container */}
                <section className="frosted-glass rounded-2xl p-4 md:p-6 shadow-2xl space-y-6">
                  
                  {/* Comments Header */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4.5 h-4.5 text-red-500" />
                      <h3 className="font-serif font-bold text-white">
                        심층 댓글 아카이브 ({comments.filter(c => screenNoise ? true : !c.isSpectral).length})
                      </h3>
                    </div>
                    <button
                      onClick={handleResetComments}
                      className="text-[11px] text-white/40 hover:text-white/80 transition-colors font-mono cursor-pointer"
                    >
                      [댓글 목록 리셋]
                    </button>
                  </div>

                  {/* Comment Input Form */}
                  <form onSubmit={handleAddComment} className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="md:w-1/4">
                        <label className="block text-[11px] font-mono text-white/40 mb-1">글쓴이 닉네임</label>
                        <input
                          type="text"
                          placeholder="익명"
                          value={newCommentAuthor}
                          onChange={(e) => setNewCommentAuthor(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-red-500/40 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] font-mono text-white/40 mb-1">댓글 내용 입력</label>
                        <input
                          type="text"
                          placeholder="의견을 입력하십시오"
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-red-500/40 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-red-400 text-xs font-mono">
                        {commentError && <span>⚠ {commentError}</span>}
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-white/5 hover:bg-red-950/40 hover:text-red-400 border border-white/10 hover:border-red-900/40 text-white text-xs font-medium rounded-xl transition-all cursor-pointer"
                      >
                        댓글 등록하기
                      </button>
                    </div>
                  </form>

                  {/* Comments list */}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    <AnimatePresence initial={false}>
                      {buildCommentTree().map((rootComment) => renderCommentNode(rootComment))}
                    </AnimatePresence>

                    {comments.filter(comment => screenNoise ? true : !comment.isSpectral).length === 0 && (
                      <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                        <p className="text-xs text-white/40 font-mono">침묵만이 가득합니다. 첫 번째 증언을 남겨주십시오.</p>
                      </div>
                    )}
                  </div>
                </section>
              </motion.div>
            )}

            {/* TAB 2: MYSTERY ARCHIVE */}
            {activeTab === "archive" && (
              <motion.div
                key="archive-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full"
              >
                {/* Profile Grid Item - Character Profile (Shinyeon) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Mystical Note header */}
                  <div className="border border-dashed border-blue-500/20 bg-blue-500/5 p-4 rounded-2xl text-center space-y-2">
                    <AlertTriangle className="w-5 h-5 text-blue-500 mx-auto animate-pulse" />
                    <h5 className="font-serif font-bold text-xs text-blue-400">영적 기록관 전언</h5>
                    <p className="text-[10px] text-white/60 leading-normal font-sans">
                      봉인된 데이터의 해제는 본인의 책무입니다.
                    </p>
                  </div>
                  
                  {/* Primary Profile Card */}
                  <div className="frosted-glass rounded-2xl overflow-hidden shadow-2xl relative">
                    {/* Glowing blue line top */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/35 to-transparent" />
                    
                    {/* Header bar */}
                    <div className="bg-white/5 px-4 py-3 md:px-6 border-b border-white/10 flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="font-sans text-xs text-blue-400 tracking-wider font-bold">기밀 파일 // 현무</span>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">LEVEL Unlimited</span>
                    </div>

                    <div className="p-4 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
                      
                      {/* Character Avatar Column */}
                      <div className="md:w-1/3 flex flex-col items-center gap-3">
                        <div className="relative group w-44 h-44 md:w-full max-w-[200px] aspect-square rounded-2xl overflow-hidden border border-white/20 bg-white/5 p-1 flex flex-col items-center justify-center transition-all">
                          <div className="relative w-full h-full">
                            <img
                              src={CHARACTER_DATA.avatarUrl || "/src/assets/images/shinyeon_avatar_1783338121566.jpg"}
                              alt="현무 일러스트"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h2 className="text-xl font-serif font-bold text-white flex items-center justify-center gap-1">
                            현무
                          </h2>
                          <p className="text-xs text-blue-400 font-serif tracking-widest mt-0.5">(玄武)</p>
                        </div>

                        {/* Traditional Seal Accent */}
                        <button
                          onClick={() => setShowSecretName(!showSecretName)}
                          className="w-full border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-lg text-[10px] font-serif text-blue-400 tracking-widest mt-2 flex items-center justify-center cursor-pointer transition-all"
                        >
                          <span>{showSecretName ? "현무(玄武)" : "진명"}</span>
                        </button>
                      </div>

                      {/* Character Details Column */}
                      <div className="flex-1 space-y-6">
                        
                        {/* Profile Block */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 font-sans text-xs md:text-sm">
                          <div>
                            <span className="text-blue-300 font-serif font-bold text-[11px] tracking-widest block mb-0.5 uppercase">기본 정보</span>
                            <span className="text-white/85 font-medium">나이 불명 | 남성</span>
                          </div>
                          <div>
                            <span className="text-blue-300 block font-serif font-bold text-[11px] tracking-widest uppercase mb-0.5">신체 조건</span>
                            <span className="text-white/85 font-medium">{CHARACTER_DATA.body}</span>
                          </div>
                          <div className="md:col-span-2 pt-2 border-t border-white/5">
                            <span className="text-blue-300 block font-serif font-bold text-[11px] tracking-widest uppercase mb-0.5">외형 특징</span>
                            <span className="text-white/80">{CHARACTER_DATA.appearance}</span>
                          </div>
                          <div className="md:col-span-2 pt-2 border-t border-white/5">
                            <span className="text-blue-300 block font-serif font-bold text-[11px] tracking-widest uppercase mb-0.5">복식 및 의상</span>
                            <span className="text-white/80">{CHARACTER_DATA.clothing}</span>
                          </div>
                        </div>

                        {/* Abilities Block */}
                        <div className="space-y-2">
                          <h4 className="font-serif font-bold text-blue-400 text-xs md:text-sm flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span>보유 능력 (Abilities)</span>
                          </h4>
                          <ul className="space-y-1.5">
                            {CHARACTER_DATA.abilities.map((ability, i) => (
                              <li key={i} className="text-xs bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-white/80 flex items-start gap-2">
                                <span className="text-blue-400 font-serif">◈</span>
                                <span>{ability}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Personality Block */}
                        <div className="space-y-2">
                          <h4 className="font-serif font-bold text-white/60 text-xs md:text-sm flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span>심리 상태 및 성격 (Personality)</span>
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {CHARACTER_DATA.personalities.map((trait, i) => (
                              <span key={i} className="text-xs bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg text-red-400 font-semibold">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Likes & Dislikes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1.5">
                            <span className="text-[11px] font-serif font-bold tracking-widest text-green-400 block mb-0.5 uppercase">[호(好)]</span>
                            <ul className="text-xs space-y-1 text-white/80 font-sans">
                              {CHARACTER_DATA.likes.map((like, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-green-500/60">•</span>
                                  <span>{like}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1.5">
                            <span className="text-[11px] font-serif font-bold tracking-widest text-red-400 block mb-0.5 uppercase">[불호(不好)]</span>
                            <ul className="text-xs space-y-1 text-white/80 font-sans">
                              {CHARACTER_DATA.dislikes.map((dislike, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-red-500/60">•</span>
                                  <span>{dislike}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* RESTRICTED INTERACTIVE SECTION 1: SEX PROFILE */}
                  <div className="frosted-glass rounded-2xl overflow-hidden shadow-2xl relative transition-all border border-red-500/20">
                    
                    {/* Glowing Red border top */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/40" />

                    {/* Locked Title bar */}
                    <div className="bg-white/5 px-4 py-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Lock className={`w-4 h-4 ${isSexUnlocked ? "text-green-400" : "text-red-500 animate-pulse"}`} />
                        <h3 className="font-serif font-bold text-sm tracking-widest text-red-400">
                          [기밀] 성적 데이터베이스
                        </h3>
                      </div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {!isSexUnlocked ? (
                        <motion.div
                          key="sex-locked"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-6 md:p-10 flex flex-col items-center justify-center text-center space-y-4 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12)_0%,transparent_70%)]"
                        >
                          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-400 shadow-lg glow-red">
                            <Skull className="w-8 h-8 animate-pulse" />
                          </div>
                          
                          <div className="max-w-md space-y-2">
                            <h4 className="font-serif font-bold text-white text-sm md:text-base">
                              현무(玄武)의 내밀한 성향
                            </h4>
                          </div>

                          <button
                            onClick={() => {
                              setIsSexUnlocked(true);
                              setGlitchActive(true);
                              setTimeout(() => setGlitchActive(false), 300);
                            }}
                            className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-serif text-xs font-bold rounded-xl border border-red-500/20 transition-all shadow-lg tracking-wider flex items-center gap-2 glow-red cursor-pointer"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>금기 해제하고 프로필 열람</span>
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sex-unlocked"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="p-4 md:p-6 space-y-6 bg-white/5"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                              <span className="text-[10px] font-mono tracking-wider text-red-400 font-bold block">POSITION</span>
                              <span className="text-sm font-serif font-bold text-white block">{CHARACTER_DATA.sex.position}</span>
                            </div>

                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                              <span className="text-[10px] font-mono tracking-wider text-red-400 font-bold block">TENDENCY</span>
                              <span className="text-sm font-serif font-bold text-white block">{CHARACTER_DATA.sex.tendency}</span>
                            </div>

                          </div>

                          <div className="space-y-4">
                            <span className="text-[10px] font-mono tracking-wider text-red-400 font-bold block uppercase">PREFERENCES & LUST DETAILED PROFILE</span>
                            
                            <div className="space-y-4">
                              {/* Group 1 */}
                              <div className="space-y-2">
                                <span className="text-[9px] font-mono text-white/40 block uppercase">일상 관리 및 통제</span>
                                <div className="flex flex-wrap gap-2">
                                  {["일상 관리", "신체 검사", "음담 패설(수치심 유발)", "반항 시 스팽킹"].map((pref, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-xl hover:bg-red-500/10 transition-all text-xs md:text-sm font-serif font-bold text-red-300">
                                      {pref}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Group 2 */}
                              <div className="space-y-2">
                                <span className="text-[9px] font-mono text-white/40 block uppercase">체위 및 밀착</span>
                                <div className="flex flex-wrap gap-2">
                                  {["교배 프레스", "에키벤", "수면간", "애무 절정"].map((pref, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-xl hover:bg-red-500/10 transition-all text-xs md:text-sm font-serif font-bold text-red-300">
                                      {pref}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Group 3 */}
                              <div className="space-y-2">
                                <span className="text-[9px] font-mono text-white/40 block uppercase">낙인 및 절정</span>
                                <div className="flex flex-wrap gap-2">
                                  {["마킹", "내사정 필수", "크림파이"].map((pref, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-xl hover:bg-red-500/10 transition-all text-xs md:text-sm font-serif font-bold text-red-300">
                                      {pref}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              onClick={() => setIsSexUnlocked(false)}
                              className="text-[10px] font-mono text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              [성적 기밀 데이터 다시 잠그기]
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* RESTRICTED INTERACTIVE SECTION 2: PAST / BACKSTORY */}
                  <div className="frosted-glass rounded-2xl overflow-hidden shadow-2xl relative transition-all border border-blue-500/20">
                    
                    {/* Glowing Blue border top */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500/40" />

                    {/* Locked Title bar */}
                    <div className="bg-white/5 px-4 py-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Lock className={`w-4 h-4 ${isPastUnlocked ? "text-green-400" : "text-blue-500 animate-pulse"}`} />
                        <h3 className="font-serif font-bold text-sm tracking-widest text-blue-400">
                          [기밀] 과거사
                        </h3>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {!isPastUnlocked ? (
                        <motion.div
                          key="past-locked"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-6 md:p-10 flex flex-col items-center justify-center text-center space-y-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_70%)]"
                        >
                          <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg glow-blue">
                            <Compass className="w-8 h-8 animate-pulse" />
                          </div>
                          
                          <div className="max-w-md space-y-2">
                            <h4 className="font-serif font-bold text-white text-sm md:text-base">
                              현무(玄武)의 아득한 기원
                            </h4>
                          </div>

                          <button
                            onClick={() => {
                              setIsPastUnlocked(true);
                              setGlitchActive(true);
                              setTimeout(() => setGlitchActive(false), 300);
                            }}
                            className="px-6 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-serif text-xs font-bold rounded-xl border border-blue-500/20 transition-all shadow-lg tracking-wider flex items-center gap-2 glow-blue cursor-pointer"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>과거 해제하고 진실 확인</span>
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="past-unlocked"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="p-4 md:p-8 bg-white/5 space-y-4 text-white/80 font-sans leading-relaxed text-xs md:text-sm whitespace-pre-line border-t border-white/5"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-4 w-full">
                            <div className="flex items-center gap-2">
                              <div className="px-2 py-0.5 bg-blue-500/10 text-blue-400 font-mono text-[10px] rounded-lg border border-blue-500/20">
                                DECRYPTED LORE
                              </div>
                              <span className="font-serif font-bold text-xs text-blue-300">지박령이 된 신(神)과 속박된 그물</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1">{renderPastLore(pastLore)}</div>
                          </div>

                          <div className="flex justify-end items-center pt-6 border-t border-white/10 mt-6">
                            <button
                              onClick={() => setIsPastUnlocked(false)}
                              className="text-[10px] font-mono text-white/40 hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              [과거사 데이터 다시 봉인하기]
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                {/* Places Column - Right Sidebar (Main Locations Guide) */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Unified Places Card */}
                  <div className="frosted-glass rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    {/* Header */}
                    <div className="p-4 md:p-5 border-b border-white/10 bg-white/5 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <h3 className="font-serif font-bold text-white text-sm">주요 장소 아카이브 (Locations)</h3>
                    </div>

                    {/* Places list inside the same container */}
                    <div className="p-4 md:p-5 space-y-6">
                      {PLACES_DATA.map((place, idx) => (
                        <React.Fragment key={idx}>
                          <div
                            className="space-y-3 relative transition-all group"
                          >
                            <div>
                              <h4 className="text-sm md:text-base font-serif font-bold text-white flex items-center gap-1.5">
                                <span className="text-red-500 font-bold">▶</span>
                                {place.name}
                              </h4>
                              <span className="text-[10px] text-white/40 font-mono block mt-0.5">
                                위치 : {place.location}
                              </span>
                            </div>

                            <p className="text-xs md:text-sm text-white/90 leading-relaxed font-sans border-l-2 border-red-500/40 pl-2.5 break-keep">
                              {place.description}
                            </p>
                          </div>
                          {idx === 0 && (
                            <div className="border-t border-white/20 my-4" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Deleted original footer sidebar to move upward */}

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-12 pt-6 pb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 font-mono relative z-20">
          <div className="text-center md:text-left">
            <p>© 2026 玄武. ALL SECRETS RECORDED.</p>
          </div>
          
          <div className="flex gap-4">
            <span className="text-white/30 hover:text-white/60 cursor-default">GATE: ACTIVE</span>
            <span>|</span>
            <span className="text-white/30 hover:text-white/60 cursor-default">PARADIGM: SHIFT</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
