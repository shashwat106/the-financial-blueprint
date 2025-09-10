import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthContext";
import { 
  Award, 
  Trophy, 
  Star,
  Sparkles,
  Clock,
  Zap
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Achievement {
  id: string;
  achievementType: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: string;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  totalExpenses: number;
  totalSavings: number;
  goalsCompleted: number;
  budgetsCreated: number;
  consecutiveDaysTracking: number;
}

const rarityColors = {
  common: "bg-gray-100 text-gray-700 border-gray-200",
  rare: "bg-blue-100 text-blue-700 border-blue-200",
  epic: "bg-purple-100 text-purple-700 border-purple-200",
  legendary: "bg-yellow-100 text-yellow-700 border-yellow-200"
};

const rarityIcons = {
  common: Star,
  rare: Award,
  epic: Trophy,
  legendary: Sparkles
};

export function AchievementSystem() {
  const { user, token } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [newAchievementDialog, setNewAchievementDialog] = useState<{
    open: boolean;
    achievement: Achievement | null;
  }>({ open: false, achievement: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchAchievements();
      fetchStats();
      checkForNewAchievements();
    }
  }, [user, token]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/achievements/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
    setLoading(false);
  };

  const checkForNewAchievements = async () => {
    try {
      const response = await fetch('/api/achievements/check', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.newAchievements.length > 0) {
          // Show each new achievement
          data.newAchievements.forEach((achievement: Achievement, index: number) => {
            setTimeout(() => {
              setNewAchievementDialog({ open: true, achievement });
              toast.success(`🎉 Achievement Unlocked: ${achievement.title}!`);
            }, index * 1000);
          });
          // Refresh achievements list
          fetchAchievements();
        }
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  const getTimeSinceUnlocked = (unlockedAt: string) => {
    const now = new Date();
    const unlocked = new Date(unlockedAt);
    const diffInMinutes = Math.floor((now.getTime() - unlocked.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!user) {
    return null;
  }

  const recentAchievements = achievements.slice(0, 3);

  return (
    <>
      {/* Achievement Widget for Dashboard */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Recent Achievements
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAllAchievements(true)}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading achievements...</p>
          ) : achievements.length === 0 ? (
            <div className="text-center py-4">
              <Award className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No achievements yet</p>
              <p className="text-xs text-muted-foreground">Start tracking expenses to unlock your first achievement!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAchievements.map((achievement) => {
                const RarityIcon = rarityIcons[achievement.rarity];
                return (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <Badge className={`text-xs ${rarityColors[achievement.rarity]}`}>
                          <RarityIcon className="h-3 w-3 mr-1" />
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeSinceUnlocked(achievement.unlockedAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Achievements Dialog */}
      <Dialog open={showAllAchievements} onOpenChange={setShowAllAchievements}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              All Achievements ({achievements.length})
            </DialogTitle>
          </DialogHeader>
          
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.budgetsCreated}</div>
                <div className="text-xs text-blue-700">Budgets Created</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.goalsCompleted}</div>
                <div className="text-xs text-green-700">Goals Completed</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">${stats.totalExpenses.toLocaleString()}</div>
                <div className="text-xs text-purple-700">Total Tracked</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{achievements.length}</div>
                <div className="text-xs text-yellow-700">Achievements</div>
              </div>
            </div>
          )}

          <div className="grid gap-3">
            {achievements.map((achievement) => {
              const RarityIcon = rarityIcons[achievement.rarity];
              return (
                <div key={achievement.id} className={`p-4 rounded-lg border-2 ${rarityColors[achievement.rarity]} bg-opacity-20`}>
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <Badge className={rarityColors[achievement.rarity]}>
                          <RarityIcon className="h-3 w-3 mr-1" />
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Unlocked {getTimeSinceUnlocked(achievement.unlockedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Achievement Celebration Dialog */}
      <Dialog 
        open={newAchievementDialog.open} 
        onOpenChange={(open) => setNewAchievementDialog({ open, achievement: null })}
      >
        <DialogContent className="max-w-md text-center">
          <div className="py-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Achievement Unlocked!</h2>
            
            {newAchievementDialog.achievement && (
              <div className="space-y-4">
                <div className="text-4xl">{newAchievementDialog.achievement.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {newAchievementDialog.achievement.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {newAchievementDialog.achievement.description}
                  </p>
                </div>
                <Badge className={`text-sm ${rarityColors[newAchievementDialog.achievement.rarity]}`}>
                  {newAchievementDialog.achievement.rarity.toUpperCase()} ACHIEVEMENT
                </Badge>
                <Button 
                  onClick={() => setNewAchievementDialog({ open: false, achievement: null })}
                  className="w-full mt-4"
                >
                  Awesome! 🎯
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}