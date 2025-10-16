import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Share2, Repeat2, Facebook, Twitter, Copy, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  postId: string;
  postTitle: string;
  postContent: string;
}

export default function ShareButtons({ postId, postTitle, postContent }: ShareButtonsProps) {
  const [repostCaption, setRepostCaption] = useState("");
  const [reposting, setReposting] = useState(false);
  const { toast } = useToast();

  const shareToWhatsApp = async () => {
    const text = `${postTitle}\n\n${postContent}\n\nView on SokoConnect`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    
    await recordShare("whatsapp");
    window.open(url, "_blank");
  };

  const shareToFacebook = async () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    
    await recordShare("facebook");
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToTwitter = async () => {
    const text = `${postTitle} - ${postContent.substring(0, 100)}...`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    
    await recordShare("twitter");
    window.open(url, "_blank", "width=600,height=400");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    await recordShare("copy_link");
    
    toast({
      title: "Link Copied",
      description: "Post link copied to clipboard",
    });
  };

  const recordShare = async (platform: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("community_post_shares").insert({
        post_id: postId,
        user_id: user.id,
        platform,
      });
    } catch (error) {
      console.error("Error recording share:", error);
    }
  };

  const handleRepost = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to repost",
          variant: "destructive",
        });
        return;
      }

      setReposting(true);

      const { error } = await supabase.from("community_post_reposts").insert({
        original_post_id: postId,
        reposted_by: user.id,
        repost_caption: repostCaption,
      });

      if (error) throw error;

      toast({
        title: "Reposted",
        description: "Post has been reposted to your profile",
      });

      setRepostCaption("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setReposting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Share Dropdown */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button onClick={shareToWhatsApp} variant="outline" className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              WhatsApp
            </Button>
            <Button onClick={shareToFacebook} variant="outline" className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              Facebook
            </Button>
            <Button onClick={shareToTwitter} variant="outline" className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-blue-400" />
              Twitter
            </Button>
            <Button onClick={copyLink} variant="outline" className="flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Repost Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Repeat2 className="h-4 w-4 mr-2" />
            Repost
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Repost to Your Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold text-sm">{postTitle}</p>
              <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{postContent}</p>
            </div>
            <Textarea
              placeholder="Add your thoughts (optional)..."
              value={repostCaption}
              onChange={(e) => setRepostCaption(e.target.value)}
              rows={3}
            />
            <Button onClick={handleRepost} disabled={reposting} className="w-full">
              {reposting ? "Reposting..." : "Repost"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
