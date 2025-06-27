import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import Navigation from "../components/Navigation";
import CoursePlayer from "../components/CoursePlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, Users, BookOpen, MessageSquare, Download, Play } from "lucide-react";
import { apiRequest } from "../lib/queryClient";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: [`/api/courses/${id}`],
    enabled: !!id,
  });

  const { data: enrollment } = useQuery({
    queryKey: ["/api/enrollments"],
    enabled: !!user,
    select: (enrollments) => enrollments.find(e => e.courseId === parseInt(id)),
  });

  const { data: discussions = [] } = useQuery({
    queryKey: [`/api/courses/${id}/discussions`],
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: [`/api/courses/${id}/reviews`],
    enabled: !!id,
  });

  const enrollMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/enrollments", { courseId: parseInt(id) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      toast({
        title: "Success",
        description: "You have been enrolled in this course!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    },
  });

  const createDiscussionMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", `/api/courses/${id}/discussions`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${id}/discussions`] });
      toast({
        title: "Success",
        description: "Discussion topic created successfully!",
      });
    },
  });

  const handleEnroll = () => {
    if (course.price > 0) {
      window.location.href = `/checkout/${id}`;
    } else {
      enrollMutation.mutate();
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowPlayer(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Course Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The course you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {showPlayer && selectedLesson && (
        <CoursePlayer
          lesson={selectedLesson}
          course={course}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {/* Course Header */}
      <section className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary">{course.category?.name}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{course.rating || "4.5"}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({reviews.length} reviews)
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {course.studentCount} students
                  </span>
                </div>
                
                {course.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {Math.round(course.duration / 60)} hours
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={course.instructor?.profileImageUrl} />
                  <AvatarFallback>
                    {course.instructor?.firstName?.[0]}{course.instructor?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Course Instructor
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    {course.price > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${course.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-green-600">Free</span>
                    )}
                  </div>
                  
                  {enrollment ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                      <Button className="w-full" onClick={() => handleLessonClick(course.lessons?.[0])}>
                        Continue Learning
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  )}
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {course.lessons?.length || 0} lessons
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Downloadable resources
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Discussion forum
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>About This Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {course.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Master the fundamentals and advanced concepts
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Build real-world projects to strengthen your skills
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Get personalized feedback from industry experts
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.lessons?.map((lesson, index) => (
                      <div 
                        key={lesson.id}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          enrollment ? '' : 'opacity-75'
                        }`}
                        onClick={() => enrollment && handleLessonClick(lesson)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {lesson.title}
                              </h4>
                              {lesson.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {lesson.duration && (
                              <span className="text-sm text-gray-500">
                                {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                              </span>
                            )}
                            {enrollment ? (
                              <Play className="w-4 h-4 text-blue-600" />
                            ) : (
                              <div className="w-4 h-4 border border-gray-400 rounded" />
                            )}
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                        No lessons available yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions">
              <div className="space-y-6">
                {enrollment && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Start a Discussion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.target);
                          createDiscussionMutation.mutate({
                            title: formData.get('title'),
                            content: formData.get('content'),
                          });
                          e.target.reset();
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <input
                            name="title"
                            placeholder="Discussion title"
                            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                            required
                          />
                        </div>
                        <div>
                          <Textarea
                            name="content"
                            placeholder="What would you like to discuss?"
                            rows={4}
                            required
                          />
                        </div>
                        <Button type="submit" disabled={createDiscussionMutation.isPending}>
                          {createDiscussionMutation.isPending ? "Posting..." : "Post Discussion"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <Card key={discussion.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={discussion.user?.profileImageUrl} />
                            <AvatarFallback>
                              {discussion.user?.firstName?.[0]}{discussion.user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {discussion.title}
                              </h4>
                              <span className="text-sm text-gray-500">
                                by {discussion.user?.firstName} {discussion.user?.lastName}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                              {discussion.content}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{discussion.upvotes} upvotes</span>
                              <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {discussions.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No discussions yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {enrollment 
                            ? "Be the first to start a discussion!"
                            : "Enroll in this course to join the discussion."
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {course.rating || "4.5"}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${
                              i < Math.floor(course.rating || 4.5) 
                                ? "text-yellow-500 fill-current" 
                                : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {reviews.length} reviews
                      </p>
                    </CardContent>
                  </Card>
                  
                  <div className="md:col-span-2">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Rating Distribution</h3>
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = reviews.filter(r => r.rating === rating).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          
                          return (
                            <div key={rating} className="flex items-center space-x-2 mb-2">
                              <span className="text-sm w-3">{rating}</span>
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-yellow-500 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.user?.profileImageUrl} />
                            <AvatarFallback>
                              {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {review.user?.firstName} {review.user?.lastName}
                              </h4>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${
                                      i < review.rating 
                                        ? "text-yellow-500 fill-current" 
                                        : "text-gray-300"
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 dark:text-gray-300">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {reviews.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No reviews yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Be the first to leave a review for this course!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
