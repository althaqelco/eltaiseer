"use client";

import { Shield, Users, Clock, Award, Headphones, CheckCircle, Sparkles, Target, ThumbsUp } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "ضمان الموثوقية",
    description: "جميع العقارات المعروضة موثقة ومتحقق منها لضمان حقوقك",
    gradient: "from-blue-500 to-blue-600",
    shadowColor: "shadow-blue-500/25",
  },
  {
    icon: Users,
    title: "فريق متخصص",
    description: "فريق من الخبراء العقاريين بخبرة تتجاوز 5 سنوات في سوق دمياط الجديدة",
    gradient: "from-orange-500 to-red-500",
    shadowColor: "shadow-orange-500/25",
  },
  {
    icon: Clock,
    title: "توفير الوقت",
    description: "نختصر عليك عناء البحث بتقديم أفضل الخيارات المناسبة لاحتياجاتك",
    gradient: "from-emerald-500 to-teal-500",
    shadowColor: "shadow-emerald-500/25",
  },
  {
    icon: Award,
    title: "أفضل الأسعار",
    description: "نضمن لك الحصول على أفضل سعر في السوق مع خيارات دفع مرنة",
    gradient: "from-purple-500 to-violet-600",
    shadowColor: "shadow-purple-500/25",
  },
  {
    icon: Headphones,
    title: "دعم مستمر",
    description: "نحن معك في كل خطوة من البحث حتى استلام عقارك",
    gradient: "from-cyan-500 to-blue-500",
    shadowColor: "shadow-cyan-500/25",
  },
  {
    icon: Target,
    title: "دقة في الاختيار",
    description: "نساعدك في اختيار العقار المثالي بناءً على احتياجاتك وميزانيتك",
    gradient: "from-rose-500 to-pink-600",
    shadowColor: "shadow-rose-500/25",
  },
];

export function WhyUsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500 rounded-full filter blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full filter blur-[100px]" />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">شريكك الموثوق</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            لماذا <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">التيسير</span> للعقارات؟
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            نحن شريكك الموثوق في رحلة البحث عن عقارك المثالي في دمياط الجديدة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-500"
            >
              {/* Glow Effect on Hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg ${feature.shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-medium">معاملات آمنة</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-medium">عقارات موثقة</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <ThumbsUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-medium">+500 عميل سعيد</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
