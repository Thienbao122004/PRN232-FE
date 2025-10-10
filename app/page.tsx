"use client"

import { useRef, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import LanguageSwitcher from "@/components/language-switcher"
import {
  Zap,
  MapPin,
  Battery,
  Shield,
  Clock,
  ChevronRight,
  Star,
  Users,
  Leaf,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export default function HomePage() {
  const t = useTranslations("home")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const heroImages = [
    { src: "/vinfast-vf-8-electric-suv.jpg", alt: "VinFast VF 8 Electric SUV", title: "VinFast VF 8" },
    { src: "/vinfast-vf-e34-electric-suv.jpg", alt: "VinFast VF e34 Electric SUV", title: "VinFast VF e34" },
    { src: "/vinfast-vf-5-electric-hatchback.jpg", alt: "VinFast VF 5 Electric Hatchback", title: "VinFast VF 5" },
  ]

  const vehicles = [
    {
      name: "VinFast VF 8",
      type: t("vehicles.premium"),
      image: "/vinfast-vf-8-electric-suv.jpg",
      range: "420 km",
      seats: "5-7",
      price: "800.000đ",
    },
    {
      name: "VinFast VF e34",
      type: t("vehicles.urban"),
      image: "/vinfast-vf-e34-electric-suv.jpg",
      range: "285 km",
      seats: "5",
      price: "600.000đ",
    },
    {
      name: "VinFast VF 5",
      type: t("vehicles.compact"),
      image: "/vinfast-vf-5-electric-hatchback.jpg",
      range: "300 km",
      seats: "5",
      price: "450.000đ",
    },
  ]

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % 3)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + 3) % 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#vehicles" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              {t("nav.vehicles")}
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              {t("nav.features")}
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              {t("nav.howItWorks")}
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              {t("nav.pricing")}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" className="font-medium">
                {t("nav.login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-medium shadow-lg shadow-blue-500/30">
                {t("nav.signUp")}
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 pb-8 lg:pt-24 lg:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-200/20 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-xl" />
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                <Leaf className="w-4 h-4" />
                <span className="font-medium">{t("hero.badge")}</span>
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight"
            >
              {t("hero.title")}
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {t("hero.subtitle")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-muted-foreground text-pretty"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  {t("hero.bookNow")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="px-8 bg-white hover:bg-gray-50 transition-all">
                  {t("hero.learnMore")}
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-6 pt-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-green-400 border-2 border-white shadow-md"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold text-gray-900">10,000+</div>
                  <div className="text-gray-600 text-xs">{t("hero.customers")}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">4.9/5</span> {t("hero.rating")}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Vehicle Image Showcase */}
          <motion.div
            style={{ opacity, scale }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative h-[400px] lg:h-[450px]"
          >
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
              {heroImages.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: currentImageIndex === index ? 1 : 0,
                    scale: currentImageIndex === index ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold mb-1"
                    >
                      {img.title}
                    </motion.h3>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/90 text-sm"
                    >
                      {t("hero.vehicleDescription")}
                    </motion.p>
                  </div>
                </motion.div>
              ))}

              {/* Carousel Controls */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-900" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImageIndex === index ? "bg-white w-8" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Stats Cards - Repositioned to not overlap with text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-4 left-4 bg-white rounded-2xl shadow-xl p-3 hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                  <Battery className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">100%</div>
                  <div className="text-xs text-gray-600">{t("stats.battery")}</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-xl p-3 hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">50+</div>
                  <div className="text-xs text-gray-600">{t("stats.stations")}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vehicles Section */}
      <motion.section
        id="vehicles"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gray-50 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-y-48 translate-x-48" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-100/30 rounded-full blur-3xl translate-y-40 -translate-x-40" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 space-y-3">
            <Badge className="inline-flex px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
              {t("vehicles.badge")}
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">{t("vehicles.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("vehicles.description")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">{vehicle.type}</Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Battery className="w-4 h-4" />
                        <span>{vehicle.range}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{vehicle.seats}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-600">{t("vehicles.from")}</div>
                      <div className="text-2xl font-bold text-blue-600">{vehicle.price}</div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white">
                      {t("vehicles.rentNow")}
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="py-4 bg-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: MapPin, value: "50+", label: t("stats.stations") },
              { icon: Battery, value: "100%", label: t("stats.battery") },
              { icon: Shield, value: "100%", label: t("stats.insurance") },
              { icon: Clock, value: t("stats.flexible"), label: t("stats.flexibleDesc") },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center space-y-2"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl mb-2">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-8 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-100/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-100/20 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 space-y-3">
            <Badge className="inline-flex px-4 py-2 bg-green-50 text-green-700 border-green-200">
              {t("features.badge")}
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">{t("features.title")}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: MapPin,
                title: t("features.stations.title"),
                description: t("features.stations.description"),
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Battery,
                title: t("features.battery.title"),
                description: t("features.battery.description"),
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Shield,
                title: t("features.insurance.title"),
                description: t("features.insurance.description"),
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Clock,
                title: t("features.flexible.title"),
                description: t("features.flexible.description"),
                color: "text-green-600",
                bg: "bg-green-50",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Benefits Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-6 lg:p-8"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                t("benefits.transparent"),
                t("benefits.support"),
                t("benefits.quick"),
                t("benefits.cancel"),
                t("benefits.rewards"),
                t("benefits.maintenance"),
              ].map((benefit, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-4 bg-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-blue-100/30 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-green-100/30 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-4xl font-bold text-balance">{t("howItWorks.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">{t("howItWorks.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                step: t("howItWorks.step1.number"),
                title: t("howItWorks.step1.title"),
                description: t("howItWorks.step1.description"),
              },
              {
                icon: MapPin,
                step: t("howItWorks.step2.number"),
                title: t("howItWorks.step2.title"),
                description: t("howItWorks.step2.description"),
              },
              {
                icon: Zap,
                step: t("howItWorks.step3.number"),
                title: t("howItWorks.step3.title"),
                description: t("howItWorks.step3.description"),
              },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-pretty">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-4 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-yellow-100/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-100/20 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-4xl font-bold text-balance">{t("testimonials.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">{t("testimonials.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: t("testimonials.customer1.name"),
                role: t("testimonials.customer1.role"),
                content: t("testimonials.customer1.content"),
                rating: 5,
              },
              {
                name: t("testimonials.customer2.name"),
                role: t("testimonials.customer2.role"),
                content: t("testimonials.customer2.content"),
                rating: 5,
              },
              {
                name: t("testimonials.customer3.name"),
                role: t("testimonials.customer3.role"),
                content: t("testimonials.customer3.content"),
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="border-0 shadow-lg h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-pretty">"{testimonial.content}"</p>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center space-y-6 relative z-10">
          <Badge className="inline-flex px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            {t("cta.badge")}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">{t("cta.title")}</h2>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">
            {t("cta.subtitle")} <span className="font-bold text-white">{t("cta.discount")}</span>{" "}
            {t("cta.discountDesc")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 h-14 font-medium shadow-xl"
              >
                {t("cta.signUp")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 h-14 font-medium bg-transparent"
              >
                {t("cta.contact")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">EV Station</span>
              </div>
              <p className="text-gray-400 text-sm">{t("footer.description")}</p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">{t("footer.products.title")}</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.products.rental")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.products.stations")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.products.pricing")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.products.app")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">{t("footer.company.title")}</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.company.about")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.company.news")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.company.careers")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.company.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">{t("footer.support.title")}</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.support.help")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.support.terms")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.support.policy")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("footer.support.privacy")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
