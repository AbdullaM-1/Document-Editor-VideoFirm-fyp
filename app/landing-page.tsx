"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { ChevronDown, Play, Wand2, FileText, Sparkles, Edit, Bold, Italic, AlignLeft, List, Save } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function LandingPage() {
  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Intro />
      <div id="features" className="h-60" />
      <DocumentWorkflow />
      <div className="h-[25vh]" />
      <AutomationComparison />
      <div className="h-[25vh]" />
      <AIEnhancement />
      <div className="h-[75vh]" />
      <DocumentEditing />
      <div className="h-[25vh]" />
      <CollaborationFeatures />
      <CTA />
    </div>
  )
}

function Intro() {
  const [activeDocumentId, setActiveDocumentId] = useState("doc-12345")

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#121212] to-[#1d1d1d] py-20 md:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-purple-500 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          <div className="flex flex-col justify-center">
            <Link
              href="#"
              className="text-2xl font-bold mb-4 hover:text-blue-400 transition-colors cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              VideoFirm
            </Link>
            <h1 className="text-5xl font-black text-white md:text-6xl lg:text-7xl">
              AI-Powered <span className="text-blue-500">Document</span> Enhancement
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Transform your writing instantly with VideoFirm. Our AI-powered platform helps you create professional,
              polished documents in minutes, not hours.
            </p>
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-transparent px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-gray-800 bg-[#1a1a1a] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-gray-800 bg-[#252525] px-4 py-2">
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 truncate rounded bg-[#333] px-4 py-1 text-center text-sm text-gray-300">
                  videofirm.com/editor/document/{activeDocumentId}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium text-white">Business Proposal</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-400">Last saved: Just now</div>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      <Save className="h-3.5 w-3.5 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
                <div className="mb-4 flex space-x-1 overflow-x-auto pb-2 border-b border-gray-700">
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    <Bold className="h-3.5 w-3.5 mr-1" />
                    Bold
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    <Italic className="h-3.5 w-3.5 mr-1" />
                    Italic
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    <AlignLeft className="h-3.5 w-3.5 mr-1" />
                    Align
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    <List className="h-3.5 w-3.5 mr-1" />
                    List
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Select defaultValue="normal">
                    <SelectTrigger className="w-[100px] h-8 text-xs">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="h1">Heading 1</SelectItem>
                      <SelectItem value="h2">Heading 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md bg-white p-4 text-black">
                  <p className="mb-2">
                    The digital transformation of small businesses has become increasingly important in today's
                    competitive landscape. Many small business owners struggle with limited resources and technical
                    expertise.
                  </p>
                  <p className="mb-2">
                    Our solution provides a comprehensive suite of digital tools that are easy to use and affordable. We
                    help small businesses establish an effective online presence without requiring extensive technical
                    knowledge.
                  </p>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="default" size="sm" className="h-8 bg-blue-600 text-xs">
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      Enhance
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Wand2 className="h-3.5 w-3.5 mr-1" />
                      Rewrite
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400">250 words | 1 min read</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Em({ children }) {
  return <b className="text-white">{children}</b>
}

function JumboText({ children }) {
  return (
    <div className="mx-auto max-w-6xl px-6 text-5xl font-black text-white md:px-12 md:text-[88px] md:leading-[96px]">
      {children}
    </div>
  )
}

function JumboP({ children, ...props }) {
  return (
    <p
      {...props}
      className="min-h-[50vh] px-6 pb-12 text-4xl font-black text-gray-100 md:mx-auto md:max-w-3xl md:text-6xl"
    >
      {children}
    </p>
  )
}

function MutationP({ children }) {
  return (
    <p className="flex min-h-[75vh] max-w-2xl items-center px-6 text-4xl font-black text-gray-100 sm:mx-auto sm:px-8 md:text-6xl">
      {children}
    </p>
  )
}

function LayoutButton({ className, active, ...props }) {
  return (
    <button
      className={cn(
        "m-2 rounded-full bg-opacity-70 px-6 py-2 font-mono text-[12px] font-bold leading-6 md:text-base",
        active ? "opacity-100" : "opacity-80",
        className,
      )}
      {...props}
    />
  )
}

function BrowserChrome({ url, children }) {
  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-900 px-4 py-2">
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 rounded bg-gray-800 px-4 py-1 text-center text-sm text-gray-200">{url}</div>
      </div>
      {children}
    </div>
  )
}

function Highlighter({ className, children }) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center rounded bg-opacity-30 ring-2 ring-inset md:rounded-lg md:ring-4",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Resources({ className, data, mod }) {
  return (
    <div className={cn("rounded bg-opacity-95 p-2 font-mono text-sm text-white md:rounded-xl md:text-xl", className)}>
      import("{mod}")
      <br />
      fetch("{data}")
    </div>
  )
}

function Network({ children, ticks = 50 }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <Ticks n={ticks} />
      <div className="h-4" />
      <div>{children}</div>
      <div className="absolute left-16 right-0 top-0 h-full sm:left-28">
        <div
          className="absolute top-0 h-full"
          style={{
            left: `${progress}%`,
          }}
        >
          <div className="-ml-1 w-2 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 7 14">
              <path
                fill="currentColor"
                d="M0 0h7v9.249a2 2 0 01-.495 1.316L3.5 14 .495 10.566A2 2 0 010 9.248V0z"
              ></path>
            </svg>
          </div>
          <div className="relative top-[-1px] h-full w-[1px] bg-blue-500" />
        </div>
      </div>
    </div>
  )
}

function Resource({ name, size, start, cancel, hideUntilStart }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const end = start + size
  const complete = progress > end
  const width = complete ? (cancel ? 0 : size) : Math.max(progress - start, 0)

  return (
    <div className="flex items-center justify-center border-b border-gray-600 last:border-b-0">
      <div className={cn("w-16 text-[length:8px] sm:w-28 sm:text-sm", width === 0 ? "opacity-0" : "")}>{name}</div>
      <div className="relative flex-1">
        <div
          className={cn("h-1 sm:h-2", complete ? (cancel ? "bg-red-500" : "bg-green-500") : "bg-blue-500")}
          style={{
            width: `${width}%`,
            marginLeft: `${start}%`,
          }}
        />
      </div>
    </div>
  )
}

function Ticks({ n }) {
  const ticks = Array.from({ length: n }).fill(null)
  return (
    <div className="absolute left-16 right-0 top-0 flex justify-around sm:left-28">
      {ticks.map((_, index) => (
        <div className={(index + 1) % 10 ? "h-1 w-[1px] bg-gray-300" : "h-[6px] w-[1px] bg-gray-50"} key={index} />
      ))}
    </div>
  )
}

function DocumentWorkflow() {
  const [activeStage, setActiveStage] = useState(0)
  const [activeDocumentId, setActiveDocumentId] = useState("doc-12345")
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  })

  return (
    <section ref={ref}>
      <JumboText>
        <h2>
          VideoFirm has a secret weapon:
          <br />
          <span className="text-yellow-500">AI-Powered Enhancement.</span>
        </h2>
      </JumboText>
      <div className="h-[25vh]" />

      <JumboP>Document editing usually has multiple stages that require careful attention.</JumboP>
      <JumboP>Not only are these stages time-consuming and tedious...</JumboP>
      <JumboP>...they're also the bottleneck that prevents writers from scaling their content.</JumboP>
      <div className="text-center text-lg text-gray-400 mb-8">
        (Hover or tap the buttons to see each stage of enhancement)
      </div>

      <div className="sticky bottom-0 pb-10">
        <div className={cn("pb-2 text-center text-4xl md:text-7xl", activeStage === 0 ? "animate-bounce" : "")}>
          <ChevronDown />
        </div>
        <div className="text-center">
          <LayoutButton
            onClick={() => setActiveStage(1)}
            onMouseEnter={() => setActiveStage(1)}
            active={activeStage === 1}
            className="bg-blue-900 text-blue-300"
          >
            &lt;Drafting&gt;
          </LayoutButton>
          <LayoutButton
            onClick={() => setActiveStage(2)}
            onMouseEnter={() => setActiveStage(2)}
            active={activeStage === 2}
            className="bg-teal-900 text-teal-300"
          >
            &lt;Enhancement&gt;
          </LayoutButton>
          <LayoutButton
            onClick={() => setActiveStage(3)}
            onMouseEnter={() => setActiveStage(3)}
            active={activeStage === 3}
            className="bg-yellow-900 text-yellow-300"
          >
            &lt;Formatting&gt;
          </LayoutButton>
          <LayoutButton
            onClick={() => setActiveStage(4)}
            onMouseEnter={() => setActiveStage(4)}
            active={activeStage === 4}
            className="bg-red-900 text-red-300"
          >
            &lt;Exporting&gt;
          </LayoutButton>
        </div>

        <div className="mt-8">
          <BrowserChrome url={getUrlForStage(activeStage, activeDocumentId)}>
            <div className="h-[42vh] sm:h-[55vh] bg-white text-black">
              <DocumentEditorVisualization
                activeStage={activeStage}
                activeDocumentId={activeDocumentId}
                setActiveDocumentId={setActiveDocumentId}
              />
            </div>
          </BrowserChrome>
        </div>
      </div>
    </section>
  )
}

function getUrlForStage(stage, documentId = "doc-12345") {
  switch (stage) {
    case 1:
      return (
        <span>
          <span className="text-blue-500">videofirm.com</span>/editor/document/{documentId}
        </span>
      )
    case 2:
      return (
        <span>
          videofirm.com/editor/document/{documentId}/<span className="text-teal-500">enhance</span>
        </span>
      )
    case 3:
      return (
        <span>
          videofirm.com/editor/document/{documentId}/<span className="text-yellow-500">format</span>
        </span>
      )
    case 4:
      return (
        <span>
          videofirm.com/editor/document/{documentId}/<span className="text-red-500">export</span>
        </span>
      )
    default:
      return `videofirm.com/editor/document/${documentId}`
  }
}

function DocumentEditorVisualization({ activeStage, activeDocumentId, setActiveDocumentId }) {
  // Sample documents with unique IDs
  const documents = [
    {
      id: "doc-12345",
      title: "Business Proposal",
      content: "Our company offers innovative solutions for small businesses...",
    },
    { id: "doc-67890", title: "Marketing Plan", content: "This marketing plan outlines our strategy for Q3..." },
    { id: "doc-24680", title: "Project Overview", content: "Project scope and timeline for the new website..." },
    { id: "doc-13579", title: "Meeting Notes", content: "Notes from the stakeholder meeting on July 15th..." },
  ]

  return (
    <div className="flex h-full">
      <div className="w-1/5 border-r border-gray-200 p-4">
        {activeStage === 1 && (
          <Highlighter className="bg-blue-500 ring-blue-500">
            <Resources className="bg-blue-900" data="/document-editor" mod="/templates" />
          </Highlighter>
        )}
        <div className="font-medium">Documents</div>
        <div className="pl-4 mt-2 text-gray-600">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`${activeDocumentId === doc.id ? "font-bold text-blue-500" : ""} 
                          cursor-pointer hover:text-blue-400 transition-colors py-1`}
              onClick={() => setActiveDocumentId(doc.id)}
            >
              {doc.title}
            </div>
          ))}
        </div>
      </div>

      <div className="w-4/5 p-4">
        {activeStage === 1 && (
          <div className="h-full">
            <Highlighter className="bg-blue-500 ring-blue-500">
              <Resources className="bg-blue-900" data={`/document-editor/${activeDocumentId}`} mod="/templates" />
            </Highlighter>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div className="font-medium">
                  {documents.find((doc) => doc.id === activeDocumentId)?.title || "Document"}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500">Last edited: 5 minutes ago</div>
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs flex items-center">
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </button>
              </div>
            </div>
            <div className="border-t border-b border-gray-200 py-2 mb-4">
              <div className="flex space-x-2 overflow-x-auto">
                <button className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                  <Bold className="h-3 w-3 mr-1" />
                  Bold
                </button>
                <button className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                  <Italic className="h-3 w-3 mr-1" />
                  Italic
                </button>
                <button className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                  <AlignLeft className="h-3 w-3 mr-1" />
                  Align
                </button>
                <button className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                  <List className="h-3 w-3 mr-1" />
                  List
                </button>
                <select className="bg-gray-100 px-2 py-1 rounded text-xs">
                  <option>Normal</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-md h-[calc(100%-8rem)] overflow-auto">
              <div className="text-sm text-gray-700 space-y-2">
                {activeDocumentId === "doc-12345" && (
                  <>
                    <p>
                      [Introduction] Our company offers innovative solutions for small businesses looking to expand
                      their digital presence.
                    </p>
                    <p>
                      [Problem Statement] Many small businesses struggle with limited resources and technical expertise
                      to establish an effective online presence.
                    </p>
                    <p>
                      [Solution] We provide a comprehensive suite of digital tools and services tailored specifically
                      for small businesses with limited budgets.
                    </p>
                    <p>
                      [Benefits] Our solution is cost-effective, easy to implement, and requires minimal technical
                      knowledge from the business owner.
                    </p>
                    <p>
                      [Pricing] We offer flexible pricing plans starting at $99/month with no long-term commitment
                      required.
                    </p>
                  </>
                )}
                {activeDocumentId === "doc-67890" && (
                  <>
                    <p>
                      [Executive Summary] This marketing plan outlines our strategy for Q3, focusing on digital channels
                      and content marketing.
                    </p>
                    <p>
                      [Target Audience] Our primary audience consists of small business owners aged 35-55 in the retail
                      and service industries.
                    </p>
                    <p>
                      [Marketing Channels] We will utilize social media, email marketing, and content marketing to reach
                      our target audience.
                    </p>
                    <p>
                      [Budget] The total marketing budget for Q3 is $50,000, with 40% allocated to digital advertising.
                    </p>
                    <p>
                      [KPIs] We will track website traffic, lead generation, conversion rates, and customer acquisition
                      cost.
                    </p>
                  </>
                )}
                {activeDocumentId === "doc-24680" && (
                  <>
                    <p>
                      [Project Scope] This project involves redesigning the company website with improved UX/UI and
                      mobile responsiveness.
                    </p>
                    <p>
                      [Timeline] The project will be completed in 12 weeks, with the first phase launching in 4 weeks.
                    </p>
                    <p>
                      [Resources] We will need a web designer, frontend developer, backend developer, and content
                      writer.
                    </p>
                    <p>
                      [Deliverables] The final deliverables include a responsive website, content management system, and
                      analytics dashboard.
                    </p>
                    <p>
                      [Success Metrics] Success will be measured by website performance, user engagement, and conversion
                      rates.
                    </p>
                  </>
                )}
                {activeDocumentId === "doc-13579" && (
                  <>
                    <p>[Meeting Date] July 15, 2023 | 10:00 AM - 11:30 AM</p>
                    <p>[Attendees] John Smith, Sarah Johnson, Michael Brown, Emily Davis</p>
                    <p>[Agenda Items] Q2 performance review, Q3 goals, new product launch, team restructuring</p>
                    <p>
                      [Key Decisions] Approved Q3 marketing budget, delayed product launch to September, hired two new
                      developers
                    </p>
                    <p>
                      [Action Items] John to finalize budget by July 20, Sarah to update product roadmap, Michael to
                      begin hiring process
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeStage === 2 && (
          <div className="h-full">
            <Highlighter className="bg-teal-500 ring-teal-500">
              <Resources className="bg-teal-900" data={`/gemini-ai/${activeDocumentId}`} mod="/enhancement-models" />
            </Highlighter>
            <div className="font-medium">AI Text Enhancement</div>
            <div className="mt-4 p-4 border border-gray-200 rounded-md h-[calc(100%-4rem)]">
              <div className="flex items-center justify-between mb-4">
                <div className="font-medium">
                  Enhancement Options for {documents.find((doc) => doc.id === activeDocumentId)?.title}
                </div>
                <div className="text-xs text-teal-500">Powered by AI</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 border border-teal-500 rounded-md bg-teal-50">
                  <div className="font-medium">Professional</div>
                  <div className="text-xs text-gray-500">Clear, concise business language</div>
                  <button className="mt-2 bg-teal-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                    <Play size={12} />
                  </button>
                </div>
                <div className="p-3 border border-gray-200 rounded-md">
                  <div className="font-medium">Persuasive</div>
                  <div className="text-xs text-gray-500">Compelling, action-oriented</div>
                  <button className="mt-2 bg-gray-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                    <Play size={12} />
                  </button>
                </div>
              </div>
              <div className="relative h-32 bg-gray-100 rounded-md p-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full px-4">
                    <div className="w-full h-16">
                      <svg viewBox="0 0 500 100" className="w-full h-full">
                        <path
                          d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50 T450,50 T500,50"
                          fill="none"
                          stroke="rgb(20 184 166)"
                          strokeWidth="2"
                        />
                        <path
                          d="M0,50 Q35,10 70,50 T140,50 T210,50 T280,50 T350,50 T420,50 T490,50"
                          fill="none"
                          stroke="rgb(20 184 166)"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="text-sm text-gray-500">Processing: 75% complete</div>
                <div className="text-sm font-medium text-teal-500">Enhancing with AI</div>
              </div>
            </div>
          </div>
        )}

        {activeStage === 3 && (
          <div className="h-full">
            <Highlighter className="bg-yellow-500 ring-yellow-500">
              <Resources
                className="bg-yellow-900"
                data={`/formatting-tools/${activeDocumentId}`}
                mod="/style-templates"
              />
            </Highlighter>
            <div className="font-medium">Document Formatting</div>
            <div className="mt-4 border border-gray-200 rounded-md h-[calc(100%-4rem)] overflow-hidden">
              <div className="bg-gray-800 text-white p-2 text-sm flex justify-between items-center">
                <div>{documents.find((doc) => doc.id === activeDocumentId)?.title || "Document"}.docx</div>
                <div className="flex items-center gap-2">
                  <button className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">Auto-Format</button>
                  <button className="bg-gray-700 px-2 py-1 rounded text-xs">Preview</button>
                </div>
              </div>
              <div className="h-[calc(100%-8rem)] bg-gray-50 relative p-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-4/5 aspect-[8.5/11] bg-white rounded overflow-hidden shadow-lg">
                    <div className="p-8">
                      <h1 className="text-xl font-bold text-center mb-6">
                        {documents.find((doc) => doc.id === activeDocumentId)?.title || "Document"}
                      </h1>
                      <h2 className="text-lg font-semibold mb-2">Introduction</h2>
                      <p className="mb-4 text-sm">
                        XYZ Digital Solutions offers innovative, comprehensive digital presence solutions specifically
                        designed for small businesses looking to expand their market reach efficiently.
                      </p>
                      <h2 className="text-lg font-semibold mb-2">Problem Statement</h2>
                      <p className="mb-4 text-sm">
                        Small businesses today face significant challenges establishing an effective online presence due
                        to limited resources, technical expertise, and competitive digital landscapes.
                      </p>
                      <h2 className="text-lg font-semibold mb-2">Our Solution</h2>
                      <p className="text-sm">
                        We provide an all-inclusive suite of digital tools and services tailored specifically for small
                        businesses with limited budgets, enabling them to compete effectively in the digital
                        marketplace.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-24 bg-gray-200 p-2">
                <div className="flex gap-2 mb-2">
                  <div className="w-16 h-12 bg-blue-100 rounded flex items-center justify-center text-xs">Header</div>
                  <div className="w-24 h-12 bg-green-100 rounded flex items-center justify-center text-xs">
                    Body Text
                  </div>
                  <div className="w-32 h-12 bg-yellow-100 rounded flex items-center justify-center text-xs">
                    Section Headings
                  </div>
                  <div className="w-24 h-12 bg-red-100 rounded flex items-center justify-center text-xs">Lists</div>
                  <div className="w-16 h-12 bg-purple-100 rounded flex items-center justify-center text-xs">Footer</div>
                </div>
                <div className="w-full bg-gray-300 h-2 rounded-full">
                  <div className="bg-yellow-500 h-full w-1/2 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStage === 4 && (
          <div className="h-full">
            <Highlighter className="bg-red-500 ring-red-500">
              <Resources className="bg-red-900" data={`/export-api/${activeDocumentId}`} mod="/format-converters" />
            </Highlighter>
            <div className="font-medium">Export Options</div>
            <div className="mt-4 p-4 border border-gray-200 rounded-md h-[calc(100%-4rem)]">
              <div className="font-medium mb-4">
                Export Document: {documents.find((doc) => doc.id === activeDocumentId)?.title}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 border border-red-500 rounded-md bg-red-50 flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-500"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">PDF</div>
                    <div className="text-xs text-gray-500">Professional Document</div>
                  </div>
                  <div className="ml-auto">
                    <input type="checkbox" className="w-4 h-4 accent-red-500" checked />
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded-md flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">DOCX</div>
                    <div className="text-xs text-gray-500">Editable Format</div>
                  </div>
                  <div className="ml-auto">
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">File Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={`${documents.find((doc) => doc.id === activeDocumentId)?.title.replace(/\s+/g, "_") || "Document"}_XYZ_Digital_Solutions.pdf`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Document Properties</label>
                  <textarea className="w-full p-2 border border-gray-300 rounded h-20 text-sm">
                    Author: John Smith Title:{" "}
                    {documents.find((doc) => doc.id === activeDocumentId)?.title || "Document"} for Small Business
                    Digital Solutions Subject: Digital Marketing Services Proposal Keywords: digital marketing, small
                    business, web development, SEO
                  </textarea>
                </div>
                <div className="flex justify-end">
                  <button className="bg-red-500 text-white px-4 py-2 rounded">Download Document</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStage === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Wand2 size={48} className="mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-bold mb-2">AI-Powered Document Enhancement</h3>
              <p className="text-gray-600 max-w-md">
                Select a document stage above to see how our AI enhances your entire writing workflow
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AutomationComparison() {
  return (
    <section>
      <JumboText>
        Through AI, our platform can eliminate nearly <span className="text-green-500">every writing bottleneck.</span>
      </JumboText>
      <div className="h-[25vh]" />
      <JumboP>
        Most writers spend hours on document editing, creating{" "}
        <span className="text-teal-500">workflow bottlenecks</span>, slower output, and{" "}
        <span className="text-red-500">creative burnout.</span>
      </JumboP>
      <JumboP>
        VideoFirm handles everything intelligently and delivers a polished document in minutes.{" "}
        <span className="text-pink-500">Way faster, stress free.</span>
      </JumboP>
      <ProductionComparison />
    </section>
  )
}

function ProductionComparison() {
  return (
    <div className="sticky top-0 flex h-screen w-full flex-col justify-center pb-4 xl:pb-56">
      <div className="xl:flex">
        <div className="relative xl:-right-10">
          <WaterfallHeader>Manual Editing</WaterfallHeader>
          <WaterfallBrowser>
            <ManualEditing />
          </WaterfallBrowser>
        </div>

        <div className="relative xl:-left-10">
          <WaterfallHeader>With VideoFirm</WaterfallHeader>
          <WaterfallBrowser>
            <AutomatedEditing />
          </WaterfallBrowser>
        </div>
      </div>
      <div className="absolute bottom-0 w-full pb-4 text-center text-sm text-gray-300 md:text-base">
        (Keep scrolling to compare)
      </div>
    </div>
  )
}

function WaterfallHeader({ children }) {
  return <div className="mb-2 text-center text-xl font-black text-white lg:mb-6 lg:text-3xl">{children}</div>
}

function WaterfallBrowser({ children, className }) {
  return (
    <div className={cn("-mb-14 origin-top scale-75 sm:mb-[-18rem] sm:scale-50 xl:w-[50vw] xl:scale-75", className)}>
      {children}
    </div>
  )
}

function ManualEditing() {
  return (
    <BrowserChrome url="writer-workflow.com/document/12345">
      <div className="h-[25vh] bg-white sm:h-[38vh] text-black p-4">
        <h3 className="font-bold text-lg mb-4">Document Editing Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-24 font-medium">Research</div>
            <div className="flex-1 h-6 bg-gray-100 rounded">
              <div className="h-full bg-blue-500 rounded" style={{ width: "100%" }}></div>
            </div>
            <div className="w-16 text-right text-sm">2 hours</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 font-medium">Drafting</div>
            <div className="flex-1 h-6 bg-gray-100 rounded">
              <div className="h-full bg-blue-500 rounded" style={{ width: "100%" }}></div>
            </div>
            <div className="w-16 text-right text-sm">3 hours</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 font-medium">Editing</div>
            <div className="flex-1 h-6 bg-gray-100 rounded">
              <div className="h-full bg-blue-500 rounded" style={{ width: "100%" }}></div>
            </div>
            <div className="w-16 text-right text-sm">2 hours</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 font-medium">Formatting</div>
            <div className="flex-1 h-6 bg-gray-100 rounded">
              <div className="h-full bg-blue-500 rounded" style={{ width: "100%" }}></div>
            </div>
            <div className="w-16 text-right text-sm">1 hour</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 font-medium">Revisions</div>
            <div className="flex-1 h-6 bg-gray-100 rounded">
              <div className="h-full bg-blue-500 rounded" style={{ width: "100%" }}></div>
            </div>
            <div className="w-16 text-right text-sm">2 hours</div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="font-medium">Total Editing Time:</div>
          <div className="font-bold text-red-500">10 hours (1-2 days)</div>
        </div>
      </div>
      <div className="h-4" />
      <Network>
        <Resource name="Research" start={0} size={25} />
        <Resource name="Drafting" start={25} size={30} />
        <Resource name="Editing" start={55} size={20} />
        <Resource name="Formatting" start={75} size={10} />
        <Resource name="Revisions" start={85} size={15} />
      </Network>
    </BrowserChrome>
  )
}

function AutomatedEditing() {
  const [activeDocumentId, setActiveDocumentId] = useState("doc-12345")

  return (
    <BrowserChrome url={`videofirm.com/document/${activeDocumentId}`}>
      <div className="h-[25vh] bg-white sm:h-[38vh] text-black p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Business Proposal</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500">Last saved: Just now</div>
              <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-md flex items-center">
                <Save className="h-3 w-3 mr-1" />
                Save
              </button>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-2 mb-3">
            <div className="flex space-x-1 overflow-x-auto">
              <button className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                <Bold className="h-3 w-3 mr-1" />
                Bold
              </button>
              <button className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                <Italic className="h-3 w-3 mr-1" />
                Italic
              </button>
              <button className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                <AlignLeft className="h-3 w-3 mr-1" />
                Align
              </button>
              <button className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                <List className="h-3 w-3 mr-1" />
                List
              </button>
              <select className="bg-gray-100 px-2 py-1 rounded text-xs">
                <option>Normal</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
              </select>
              <button className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Enhance
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm mb-2">
                <span className="font-medium">Introduction:</span> XYZ Digital Solutions offers innovative,
                comprehensive digital presence solutions specifically designed for small businesses looking to expand
                their market reach efficiently.
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Problem Statement:</span> Small businesses today face significant
                challenges establishing an effective online presence due to limited resources, technical expertise, and
                competitive digital landscapes.
              </p>
              <p className="text-sm">
                <span className="font-medium">Our Solution:</span> We provide an all-inclusive suite of digital tools
                and services tailored specifically for small businesses with limited budgets, enabling them to compete
                effectively in the digital marketplace.
              </p>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center">
                <Wand2 className="h-3 w-3 mr-1" />
                Rewrite
              </button>
              <button className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs flex items-center">
                <Edit className="h-3 w-3 mr-1" />
                Simplify
              </button>
            </div>
            <div className="text-xs text-gray-500">250 words | 1 min read</div>
          </div>
        </div>
      </div>
      <div className="h-4" />
      <Network>
        <Resource name="AI Research" start={0} size={20} />
        <Resource name="AI Drafting" start={0} size={30} />
        <Resource name="AI Enhancement" start={0} size={25} />
        <Resource name="AI Formatting" start={20} size={15} />
        <Resource name="Human Review" start={35} size={25} />
      </Network>
    </BrowserChrome>
  )
}

function AIEnhancement() {
  return (
    <section>
      <JumboText>
        Our AI text enhancement makes your writing <span className="text-red-500">as impactful as possible.</span>
      </JumboText>
      <div className="h-[10vh]" />

      <JumboP>VideoFirm can analyze your writing style and purpose to suggest the perfect enhancements.</JumboP>
      <JumboP>Clarity. Engagement. Professionalism. Even optimal word choice.</JumboP>
      <JumboP>Zero writer's block. Zero revision anxiety. Zero burnout.</JumboP>

      <div className="sticky bottom-[-5vh]">
        <EnhancementBrowser />
      </div>
    </section>
  )
}

function EnhancementBrowser() {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage(1)

      const clickTimer = setTimeout(() => {
        setStage(2)
      }, 2000)

      return () => clearTimeout(clickTimer)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <BrowserChrome url="videofirm.com/enhancement">
      <div className="h-[35vh] md:h-[45vh] bg-white text-black">
        {stage < 2 ? (
          <div className="flex h-full">
            <div className="w-1/5 border-r border-gray-200 p-4">
              <div className="font-medium">Enhancement Tools</div>
              <div className="pl-4 mt-2 text-gray-600">
                <div className={cn("p-1 rounded transition-colors", stage === 1 ? "bg-blue-100" : "")}>
                  Text Analysis
                </div>
                <div>Enhancement</div>
                <div>Suggestions</div>
                <div>History</div>
              </div>
            </div>

            <div className="w-4/5 p-4">
              <div className="font-medium">Document Analytics</div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="font-medium">Readability Score</div>
                  <div className="text-2xl font-bold mt-2">72/100</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="font-medium">Word Count</div>
                  <div className="text-2xl font-bold mt-2">1,250</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="font-medium">Reading Time</div>
                  <div className="text-2xl font-bold mt-2">4:12</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="font-medium">Engagement Score</div>
                  <div className="text-2xl font-bold mt-2">68%</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            <div className="w-1/5 border-r border-gray-200 p-4">
              <div className="font-medium">Enhancement Tools</div>
              <div className="pl-4 mt-2 text-gray-600">
                <div className="bg-blue-100 p-1 rounded">Text Analysis</div>
                <div>Enhancement</div>
                <div>Suggestions</div>
                <div>History</div>
              </div>
            </div>

            <div className="w-4/5 p-4">
              <div className="font-medium">Enhancement Suggestions</div>
              <div className="mt-4 space-y-4">
                {[
                  { issue: "Passive Voice Overuse", score: 92, impact: "Medium" },
                  { issue: "Sentence Length Variation", score: 87, impact: "High" },
                  { issue: "Word Choice Improvements", score: 95, impact: "High" },
                ].map((item, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-md flex items-center">
                    <div className="flex-1">
                      <div className="font-medium">{item.issue}</div>
                      <div className="text-xs text-gray-500 mt-1">Impact: {item.impact}</div>
                    </div>
                    <div className="w-16 h-16 flex items-center justify-center">
                      <div className="relative w-14 h-14">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#eee"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgb(34, 197, 94)"
                            strokeWidth="3"
                            strokeDasharray={`${item.score}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                          {item.score}
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 bg-blue-500 text-white px-3 py-1 rounded text-sm">Fix All</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {stage === 1 && (
        <div className="absolute left-[34%] top-[35%] w-[50%] rounded bg-gray-800 p-2 drop-shadow-md">
          <Network ticks={25}>
            <Resource name="text-analysis.js" start={0} size={44} />
            <Resource name="gemini-api.json" start={0} size={42} />
            <Resource name="readability-check.js" start={0} size={40} />
            <Resource name="style-analysis.json" start={0} size={84} />
            <Resource name="ai-suggestions.js" start={0} size={10} />
          </Network>
        </div>
      )}

      {stage === 1 && (
        <div className="absolute left-[25%] top-[25%] pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 4L21 12L13 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </BrowserChrome>
  )
}

function DocumentEditing() {
  return (
    <section>
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <div className="mb-8 text-4xl font-black text-white sm:text-5xl md:text-6xl">
          <h2 className="inline">Manual editing</h2>{" "}
          <span aria-hidden>
            ... <span className="inline h-8 md:h-14">😴</span>
          </span>
          <p>
            You ever notice most of your time is spent <span className="text-yellow-500">revising text?</span>
          </p>
        </div>
        <p className="mt-2 text-lg md:pr-52 md:text-xl lg:pr-72">
          Imagine if you could just focus on ideas and let AI handle the tedious parts. What's the point of spending
          hours rewriting and polishing when you could be creating your next brilliant piece? VideoFirm doesn't drop you
          off at the <code>draft.docx</code> cliff.{" "}
          <span className="text-gray-400">
            (What the heck does <code>passive voice</code> even mean anyway?)
          </span>
        </p>
      </div>
      <div className="h-[25vh]" />
      <JumboText>
        Intelligent, professionally styled <span className="text-blue-500">document editing</span> is built in.
      </JumboText>
      <div className="h-[25vh]" />
      <EditingFeatures />
    </section>
  )
}

function EditingFeatures() {
  return (
    <div className="xl:flex">
      <div className="p-max-w-lg flex-1 xl:mx-auto">
        <div className="xl:h-[12vh]" />
        <div className="max-w-full px-6">
          <MutationP>It's so simple it's kind of silly. Just write your draft...</MutationP>
          <MutationP>
            ...and our AI editor takes care of the rest. It looks like professional editing but requires zero technical
            knowledge from you.
          </MutationP>
          <MutationP>
            VideoFirm analyzes your content, improves clarity and flow, enhances vocabulary, and even handles grammar
            and style automatically.
          </MutationP>
          <MutationP>
            Get fancy with custom templates and professional formatting. VideoFirm handles all the styling, you simply
            choose what you like.
          </MutationP>
          <MutationP>
            Or get creative with AI-generated suggestions and improvements. VideoFirm provides the professional polish
            so you can skip the endless revisions.
          </MutationP>
          <MutationP>AI document editing. Who knew it could be this easy?</MutationP>
        </div>
      </div>

      <div className="sticky bottom-0 bg-[#252525] xl:bottom-auto xl:top-0 xl:flex xl:h-screen xl:flex-1 xl:items-center xl:self-start">
        <div className="text-sm sm:text-base md:text-lg xl:w-full p-4 overflow-auto h-[50vh]">
          <div className="bg-[#1e1e1e] p-4 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <div className="text-white font-medium">VideoFirm Text Editor</div>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Enhance</button>
                <button className="bg-gray-700 text-white px-2 py-1 rounded text-xs">Save</button>
              </div>
            </div>

            <div className="bg-white text-black rounded-md mb-4 p-4 min-h-[200px]">
              <p className="mb-2">
                The digital transformation of small businesses has become increasingly important in today's competitive
                landscape. Many small business owners struggle with limited resources and technical expertise.
              </p>
              <p className="mb-2">
                Our solution provides a comprehensive suite of digital tools that are easy to use and affordable. We
                help small businesses establish an effective online presence without requiring extensive technical
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CollaborationFeatures() {
  return (
    <section>
      <JumboText>
        Real-time collaboration <span className="text-purple-500">makes teamwork a breeze.</span>
      </JumboText>
      <div className="h-[25vh]" />
      <JumboP>Share documents with your team and work together in real-time.</JumboP>
      <JumboP>Track changes, leave comments, and get feedback instantly.</JumboP>
      <JumboP>No more emailing documents back and forth.</JumboP>
      <div className="h-[25vh]" />
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <div className="mb-8 text-4xl font-black text-white sm:text-5xl md:text-6xl">
          <h2 className="inline">Collaboration Features</h2>
        </div>
        <p className="mt-2 text-lg md:pr-52 md:text-xl lg:pr-72">
          VideoFirm makes it easy to collaborate with your team on documents.
        </p>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="bg-gradient-to-b from-[#1d1d1d] to-[#121212] py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
        <h2 className="text-4xl font-black text-white md:text-5xl lg:text-6xl">Ready to transform your writing?</h2>
        <p className="mt-6 text-xl text-gray-300">
          Get started with VideoFirm today and experience the power of AI-powered document enhancement.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  )
}
