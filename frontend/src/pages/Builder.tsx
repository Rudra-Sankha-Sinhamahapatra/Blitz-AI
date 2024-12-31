/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StepsList } from "../components/StepsList";
import { FileExplorer } from "../components/FileExplorer";
import { TabView } from "../components/TabView";
import { CodeEditor } from "../components/CodeEditor";
import { PreviewFrame } from "../components/PreviewFrame";
import { Step, FileItem, StepType } from "../types";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { parseXml } from "../steps";
import { useWebContainer } from "../hooks/useWebContainer";
// import { FileNode } from '@webcontainer/api';
import { Loader } from "../components/Loader";

// const MOCK_FILE_CONTENT = `// This is a sample file content
// import React from 'react';

// function Component() {
//   return <div>Hello World</div>;
// }

// export default Component;`;

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<
    { role: "user" | "assistant"; parts: [{ text: string }] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  const cleanCodeResponse = (response: string): string => {
    return response
      .replace(/^```[a-z]*\s*\n([\s\S]*?)\n```$/gm, "$1") // Handles code blocks at the start/end of the string
      .replace(/```[a-z]*\s*\n([\s\S]*?)\n```/g, "$1") // Handles code blocks within text
      .trim(); // Removes leading/trailing whitespace
  };

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          const finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            const currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              const file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = cleanCodeResponse(step.code ?? "");
                console.log('Before Cleaning:', step.code);
                console.log('After Cleaning:', cleanCodeResponse(step.code??""));
              }
            } else {
              /// in a folder
              const folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed",
          };
        })
      );
    }
    console.log('files: ',files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === "folder") {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [
                    child.name,
                    processFile(child, false),
                  ])
                )
              : {},
          };
        } else if (file.type === "file") {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name];
      };

      // Process each top-level file/folder
      files.forEach((file) => processFile(file, true));

      return mountStructure;
    };

    const mountStructure = createMountStructure(files);

    // Mount the structure if WebContainer is available
    console.log('mount-structure: ',mountStructure);
     webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim(),
    });
    setTemplateSet(true);

    const { prompts, uiPrompts } = response.data;

    setSteps(
      parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending",
      }))
    );

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map((part) => ({
        role: "user",
        parts: [
          {
            text: part,
          },
        ],
      })),
    });

    setLoading(false);

    setSteps((s) => [
      ...s,
      ...parseXml(stepsResponse.data.response).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);

    setLlmMessages(
      [...prompts, prompt].map((content) => ({
        role: "user",
        parts: [
          {
            text: content,
          },
        ],
      }))
    );

    // Modify the code that sets the assistant's content
    setLlmMessages((x) => [
      ...x,
      {
        role: "assistant",
        parts: [
          {
            text: cleanCodeResponse(stepsResponse.data.response),
          },
        ],
      },
    ]);
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const ensureProjectStructure = () => {
      // Check if package.json exists
      const hasPackageJson = files.some(file => file.name === 'package.json');
      
      if (!hasPackageJson) {
        const packageJsonFile: FileItem = {
          name: 'package.json',
          type: 'file',
          path: '/package.json',
          content: JSON.stringify({
            name: "preview-app",
            version: "0.0.1",
            scripts: {
              "dev": "vite",
              "build": "vite build"
            },
            dependencies: {
              "react": "^18.2.0",
              "react-dom": "^18.2.0"
            },
            devDependencies: {
              "@vitejs/plugin-react": "^4.0.0",
              "vite": "^4.3.0"
            }
          }, null, 2)
        };
        
        setFiles(prevFiles => [...prevFiles, packageJsonFile]);
      }
    };
  
    ensureProjectStructure();
  }, [files]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-blue-900 border-b border-gray-700 px-6 py-4 shadow-lg">
        <h1 className="text-xl font-semibold text-gray-100">Blitz AI</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              <div>
                <div className="flex">
                  <br />
                  {(loading || !templateSet) && <Loader />}
                  {!(loading || !templateSet) && (
                    <div className="flex">
                      <textarea
                        value={userPrompt}
                        onChange={(e) => {
                          setPrompt(e.target.value);
                        }}
                        className="p-2 w-full bg-gray-800 text-white rounded-lg border border-gray-700"
                      ></textarea>
                      <button
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as "user",
                            parts: [
                              {
                                text: userPrompt,
                              },
                            ],
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(
                            `${BACKEND_URL}/chat`,
                            {
                              messages: [...llmMessages, newMessage],
                            }
                          );
                          setLoading(false);

                          setLlmMessages((x) => [
                            ...x,
                            {
                              role: "user" as "user",
                              parts: [
                                {
                                  text: userPrompt,
                                },
                              ],
                            },
                          ]);

                          setLlmMessages((x) => [
                            ...x,
                            {
                              role: "assistant",
                              parts: [
                                {
                                  text: stepsResponse.data.response,
                                },
                              ],
                            },
                          ]);

                          setSteps((s) => [
                            ...s,
                            ...parseXml(stepsResponse.data.response).map(
                              (x) => ({
                                ...x,
                                status: "pending" as "pending",
                              })
                            ),
                          ]);
                          setPrompt("");
                        }}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg ml-2 hover:bg-purple-600 transition duration-300"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div>
          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)] overflow-auto">
              {activeTab === "code" ? (
                <CodeEditor
                  file={
                    selectedFile
                      ? {
                          ...selectedFile,
                          name: selectedFile.name || "Untitled", // Ensure name is defined
                          content: cleanCodeResponse(
                            selectedFile.content ?? ""
                          ),
                          type: selectedFile.type || "file", // Provide a default value for type
                        }
                      : null
                  }
                />
              ) : (
                webcontainer && (
                  <PreviewFrame webContainer={webcontainer} files={files} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
