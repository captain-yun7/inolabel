"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext, useSupabaseContext } from "@/lib/context";
import { updateMyProfile, changePassword, deleteMyAccount } from "@/lib/actions/profiles";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Loader,
  Box,
  Divider,
  Alert,
  Tabs,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconUser,
  IconLock,
  IconArrowLeft,
  IconCheck,
  IconAlertCircle,
  IconMessageCircle,
  IconPencil,
} from "@tabler/icons-react";
import styles from "./page.module.css";

interface UserPost {
  id: number;
  title: string;
  board_type: string;
  created_at: string;
  comment_count: number;
  like_count: number;
}

interface UserComment {
  id: number;
  content: string;
  created_at: string;
  post_id: number;
  post_title?: string;
}

export default function MyPage() {
  const router = useRouter();
  const supabase = useSupabaseContext();
  const { user, profile, isAuthenticated, isLoading, signOut, refreshProfile } = useAuthContext();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("profile");
  const [myPosts, setMyPosts] = useState<UserPost[]>([]);
  const [myComments, setMyComments] = useState<UserComment[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const fetchActivity = useCallback(async () => {
    if (!user) return;
    setActivityLoading(true);
    try {
      const [postsRes, commentsRes] = await Promise.all([
        supabase
          .from("posts")
          .select("id, title, board_type, created_at, comment_count, like_count")
          .eq("author_id", user.id)
          .eq("is_deleted", false)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("comments")
          .select("id, content, created_at, post_id")
          .eq("author_id", user.id)
          .eq("is_deleted", false)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (postsRes.data) setMyPosts(postsRes.data);

      if (commentsRes.data) {
        const postIds = [...new Set(commentsRes.data.map((c) => c.post_id))];
        const { data: posts } = await supabase
          .from("posts")
          .select("id, title")
          .in("id", postIds);

        const postMap = new Map(posts?.map((p) => [p.id, p.title]) || []);
        setMyComments(
          commentsRes.data.map((c) => ({
            ...c,
            post_title: postMap.get(c.post_id) || "삭제된 게시글",
          }))
        );
      }
    } catch {
      // 조용히 처리
    }
    setActivityLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (activeTab === "activity" && user) {
      fetchActivity();
    }
  }, [activeTab, user, fetchActivity]);

  // Profile form
  const profileForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      nickname: "",
    },
  });

  // Password form
  const passwordForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      newPassword: (value) =>
        value.length < 6 ? "비밀번호는 6자 이상이어야 합니다" : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "비밀번호가 일치하지 않습니다" : null,
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/mypage");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (profile) {
      profileForm.setFieldValue("nickname", profile.nickname || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleProfileSubmit = async (values: typeof profileForm.values) => {
    setSuccess(null);
    setError(null);

    const result = await updateMyProfile({
      nickname: values.nickname,
      avatar_url: avatarUrl
    });
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("프로필이 업데이트되었습니다.");
      await refreshProfile();
    }
  };

  const handlePasswordSubmit = async (values: typeof passwordForm.values) => {
    setSuccess(null);
    setError(null);

    const result = await changePassword(values.newPassword);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("비밀번호가 변경되었습니다.");
      passwordForm.reset();
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.prompt(
      '회원탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.\n탈퇴를 원하시면 "회원탈퇴"를 입력해주세요.'
    );
    if (confirmed !== "회원탈퇴") return;

    setIsDeletingAccount(true);
    const result = await deleteMyAccount();
    if (result.error) {
      alert(`탈퇴 실패: ${result.error}`);
      setIsDeletingAccount(false);
      return;
    }
    alert("회원탈퇴가 완료되었습니다.");
    router.push("/");
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      superadmin: "red",
      admin: "orange",
      moderator: "blue",
      vip: "yellow",
      member: "gray",
    };
    const labels: Record<string, string> = {
      superadmin: "최고관리자",
      admin: "관리자",
      moderator: "운영자",
      vip: "VIP",
      member: "멤버",
    };
    return (
      <Badge color={colors[role] || "gray"} variant="light" size="sm">
        {labels[role] || role}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Box className={styles.loading}>
        <Loader color="gray" size="lg" />
      </Box>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back Button */}
        <Link href="/" className={styles.backBtn}>
          <IconArrowLeft size={18} />
          <span>홈으로</span>
        </Link>

        {/* Header */}
        <header className={styles.header}>
          <Title order={1} className={styles.title}>
            마이페이지
          </Title>
          <Text c="dimmed" size="sm">
            프로필 정보를 확인하고 수정할 수 있습니다
          </Text>
        </header>

        {/* Alerts */}
        {success && (
          <Alert
            icon={<IconCheck size={16} />}
            color="green"
            variant="light"
            radius="md"
            mb="md"
            withCloseButton
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
            radius="md"
            mb="md"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Profile Card */}
        <Paper className={styles.card} radius="lg" p="xl" withBorder>
          <Group gap="lg" align="flex-start">
            <div className={styles.avatarUpload}>
              <ImageUpload
                value={avatarUrl}
                onChange={setAvatarUrl}
                folder="avatars"
                size={80}
              />
              <Text size="xs" c="dimmed" mt={4}>클릭하여 변경</Text>
            </div>
            <div className={styles.profileInfo}>
              <Group gap="sm" align="center">
                <Text fw={700} size="xl">
                  {profile.nickname}
                </Text>
                {getRoleBadge(profile.role)}
              </Group>
              <Text c="dimmed" size="sm">
                {user?.email}
              </Text>
              {profile.total_donation > 0 && (
                <Text size="sm" c="dimmed" mt="xs">
                  총 후원: {profile.total_donation.toLocaleString()} 하트
                </Text>
              )}
            </div>
          </Group>
        </Paper>

        <Tabs value={activeTab} onChange={setActiveTab} radius="md" mb="lg">
          <Tabs.List>
            <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>프로필</Tabs.Tab>
            <Tabs.Tab value="activity" leftSection={<IconPencil size={16} />}>내 활동</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            {/* Edit Profile */}
            <Paper className={styles.card} radius="lg" p="xl" withBorder>
              <Title order={3} mb="md">
                프로필 수정
              </Title>
              <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
                <Stack gap="md">
                  <TextInput
                    label="닉네임"
                    placeholder="닉네임을 입력하세요"
                    leftSection={<IconUser size={18} stroke={1.5} />}
                    key={profileForm.key("nickname")}
                    {...profileForm.getInputProps("nickname")}
                    size="md"
                    radius="md"
                  />
                  <Button
                    type="submit"
                    color="dark"
                    radius="md"
                    loading={profileForm.submitting}
                  >
                    프로필 저장
                  </Button>
                </Stack>
              </form>
            </Paper>

            {/* Change Password */}
            <Paper className={styles.card} radius="lg" p="xl" withBorder>
              <Title order={3} mb="md">
                비밀번호 변경
              </Title>
              <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
                <Stack gap="md">
                  <PasswordInput
                    label="새 비밀번호"
                    placeholder="새 비밀번호 (6자 이상)"
                    leftSection={<IconLock size={18} stroke={1.5} />}
                    key={passwordForm.key("newPassword")}
                    {...passwordForm.getInputProps("newPassword")}
                    size="md"
                    radius="md"
                  />
                  <PasswordInput
                    label="비밀번호 확인"
                    placeholder="비밀번호를 다시 입력하세요"
                    leftSection={<IconLock size={18} stroke={1.5} />}
                    key={passwordForm.key("confirmPassword")}
                    {...passwordForm.getInputProps("confirmPassword")}
                    size="md"
                    radius="md"
                  />
                  <Button
                    type="submit"
                    color="dark"
                    radius="md"
                    loading={passwordForm.submitting}
                  >
                    비밀번호 변경
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="activity" pt="md">
            {activityLoading ? (
              <Box style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                <Loader color="gray" size="md" />
              </Box>
            ) : (
              <Stack gap="md">
                {/* My Posts */}
                <Paper className={styles.card} radius="lg" p="xl" withBorder>
                  <Title order={3} mb="md">
                    <Group gap="xs">
                      <IconPencil size={20} />
                      내가 쓴 글 ({myPosts.length})
                    </Group>
                  </Title>
                  {myPosts.length === 0 ? (
                    <Text c="dimmed" size="sm" ta="center" py="lg">
                      작성한 게시글이 없습니다
                    </Text>
                  ) : (
                    <Stack gap="xs">
                      {myPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/community/${post.board_type}/${post.id}`}
                          className={styles.activityItem}
                        >
                          <div className={styles.activityTitle}>{post.title}</div>
                          <div className={styles.activityMeta}>
                            <Badge size="xs" variant="light" color="gray">
                              {post.board_type === "free" ? "자유" : post.board_type === "anonymous" ? "익명" : post.board_type}
                            </Badge>
                            <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
                            {post.comment_count > 0 && (
                              <span style={{ color: "var(--color-primary)" }}>
                                <IconMessageCircle size={12} style={{ verticalAlign: "middle" }} /> {post.comment_count}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </Stack>
                  )}
                </Paper>

                {/* My Comments */}
                <Paper className={styles.card} radius="lg" p="xl" withBorder>
                  <Title order={3} mb="md">
                    <Group gap="xs">
                      <IconMessageCircle size={20} />
                      내가 쓴 댓글 ({myComments.length})
                    </Group>
                  </Title>
                  {myComments.length === 0 ? (
                    <Text c="dimmed" size="sm" ta="center" py="lg">
                      작성한 댓글이 없습니다
                    </Text>
                  ) : (
                    <Stack gap="xs">
                      {myComments.map((comment) => (
                        <Link
                          key={comment.id}
                          href={`/community/free/${comment.post_id}`}
                          className={styles.activityItem}
                        >
                          <div className={styles.activityContent}>
                            {comment.content.length > 80
                              ? comment.content.slice(0, 80) + "..."
                              : comment.content}
                          </div>
                          <div className={styles.activityMeta}>
                            <span style={{ color: "var(--text-tertiary)" }}>
                              {comment.post_title}
                            </span>
                            <span>{new Date(comment.created_at).toLocaleDateString("ko-KR")}</span>
                          </div>
                        </Link>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Stack>
            )}
          </Tabs.Panel>
        </Tabs>

        <Divider my="xl" />

        {/* Logout */}
        <Button
          variant="outline"
          color="red"
          fullWidth
          radius="md"
          onClick={handleLogout}
        >
          로그아웃
        </Button>

        <Button
          variant="subtle"
          color="gray"
          fullWidth
          radius="md"
          size="xs"
          mt="sm"
          onClick={handleDeleteAccount}
          loading={isDeletingAccount}
        >
          회원탈퇴
        </Button>
      </div>
    </div>
  );
}
